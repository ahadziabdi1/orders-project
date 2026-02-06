import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { PersonOutline, EmailOutlined, HomeOutlined, LocationCityOutlined } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import LabelWithIcon from "@/app/components/common/LabelWithIcon";
import { updateProfileAction } from '@/app/actions/profiles';

export default function ProfileEditForm({ profile, onCancel, onSuccess }: any) {
    const [isUpdating, setIsUpdating] = useState(false);

    const customer = profile?.customers;

    const addressParts = customer?.delivery_address?.split(', ') || [];
    const initialStreet = addressParts[0] || '';
    const initialCity = addressParts[1] || '';

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            full_name: customer?.full_name || '',
            email: customer?.email || '',
            street: initialStreet,
            city: initialCity,
        }
    });

    const handleUpdate = async (data: any) => {
        setIsUpdating(true);
        try {
            const combinedAddress = `${data.street.trim()}, ${data.city.trim()}`;

            const payload = {
                full_name: data.full_name,
                email: data.email,
                delivery_address: combinedAddress
            };

            const result = await updateProfileAction(customer?.customer_uuid, payload);

            if (result.success) {
                toast.success(result.message || "Profile updated successfully!");
                onSuccess();
            } else {
                toast.error(result.message || "Failed to update.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleUpdate)} sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 1 }}>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <Box>
                    <LabelWithIcon icon={PersonOutline} label="Full Name" />
                    <TextField
                        fullWidth
                        {...register("full_name", {
                            required: "Name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" }
                        })}
                        error={!!errors.full_name}
                        helperText={errors.full_name?.message as string}
                        sx={{ mt: 1 }}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={EmailOutlined} label="Email Address" />
                    <TextField
                        fullWidth
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <Box>
                    <LabelWithIcon icon={HomeOutlined} label="Street Address" />
                    <TextField
                        fullWidth
                        placeholder="e.g. 123 Maple St"
                        {...register("street", { required: "Street is required" })}
                        error={!!errors.street}
                        helperText={errors.street?.message as string}
                        sx={{ mt: 1 }}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={LocationCityOutlined} label="City" />
                    <TextField
                        fullWidth
                        placeholder="e.g. New York"
                        {...register("city", { required: "City is required" })}
                        error={!!errors.city}
                        helperText={errors.city?.message as string}
                        sx={{ mt: 1 }}
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                <Button onClick={onCancel} disabled={isUpdating} sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isUpdating}
                    sx={{ bgcolor: '#0f172a', borderRadius: '8px', px: 4, textTransform: 'none', fontWeight: 600, minWidth: '140px' }}
                >
                    {isUpdating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}