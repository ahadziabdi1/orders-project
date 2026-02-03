import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { updateCustomerAction } from '@/app/actions/customers';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { HomeOutlined } from '@mui/icons-material';
import LabelWithIcon from '@/app/components/common/LabelWithIcon';

export default function CustomerEditForm({ customer, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            full_name: customer.full_name,
            email: customer.email,
            delivery_address: customer.delivery_address || '',
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {

            const payload = {
                full_name: data.full_name,
                email: data.email,
                delivery_address: data.delivery_address
            };

            const result = await updateCustomerAction(customer.id, payload);
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
                <TextField
                    label="Full Name"
                    fullWidth
                    {...register("full_name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                    })}
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message as string}
                />

                <TextField
                    label="Email Address"
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

            <Box>
                <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    {...register("delivery_address", {
                        required: "Delivery address is required",
                        maxLength: { value: 200, message: "Address is too long" }
                    })}
                    error={!!errors.delivery_address}
                    helperText={errors.delivery_address?.message as string}
                />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button
                    onClick={onCancel}
                    disabled={loading}
                    sx={{ color: '#374151', textTransform: 'none', fontWeight: 600 }}
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