import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { updateCustomerAction } from '@/app/actions/customers';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { HomeOutlined, LocationCityOutlined, EmailOutlined, PersonOutline } from '@mui/icons-material';
import LabelWithIcon from '@/app/components/common/LabelWithIcon';

export default function CustomerEditForm({ customer, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false);

    const addressParts = customer.delivery_address?.split(', ') || [];
    const initialStreet = addressParts[0] || '';
    const initialCity = addressParts[1] || '';

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            full_name: customer.full_name,
            email: customer.email,
            street: initialStreet,
            city: initialCity,
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const combinedAddress = `${data.street.trim()}, ${data.city.trim()}`;

            const payload = {
                full_name: data.full_name,
                email: data.email,
                delivery_address: combinedAddress
            };

            const result = await updateCustomerAction(customer.customer_uuid, payload);
            if (result.success) {
                toast.success("Customer updated successfully");
                onSuccess();
            } else {
                toast.error(result.message || "Failed to update");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                        disabled
                        value={customer?.email || ''}
                        sx={{ mt: 1, bgcolor: '#f8fafc' }}
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
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                <Button
                    onClick={onCancel}
                    disabled={loading}
                    sx={{ color: '#64748b', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ backgroundColor: '#0f172a', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, minWidth: '140px' }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}