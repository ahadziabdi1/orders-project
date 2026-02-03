import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { updateCustomerAction } from '@/app/actions/customers';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function CustomerEditForm({ customer, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        const result = await updateCustomerAction(customer.id, data);
        if (result.success) {
            toast.success("Customer updated");
            onSuccess();
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Full Name" fullWidth {...register("name", { required: "Name is required" })} error={!!errors.name} />
            <TextField label="Email" fullWidth {...register("email", { required: "Email is required" })} error={!!errors.email} />
            <TextField label="Phone" fullWidth {...register("phone")} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#0f172a' }}>
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}