import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { PersonOutline, EmailOutlined, HomeOutlined } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import LabelWithIcon from "@/app/components/common/LabelWithIcon";
import { updateProfileAction } from '@/app/actions/profiles'; 

export default function ProfileEditForm({ profile, onCancel, onSuccess }: any) {
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Access nested data from the join
    const customer = profile?.customers;

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            full_name: customer?.full_name || '',
            delivery_address: customer?.delivery_address || '',
        }
    });

    const handleUpdate = async (formData: any) => {
        setIsUpdating(true);
        try {
            // Use customer_uuid for the update action
            const result = await updateProfileAction(customer?.customer_uuid, formData);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleUpdate)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Box>
                <LabelWithIcon icon={EmailOutlined} label="Email Address (Fixed)" />
                <TextField
                    fullWidth
                    disabled
                    value={customer?.email || ''}
                    sx={{ mt: 1, bgcolor: '#f8fafc' }}
                />
            </Box>

            <Box>
                <LabelWithIcon icon={PersonOutline} label="Full Name" />
                <TextField
                    fullWidth
                    {...register("full_name", { required: "Name is required" })}
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message as string}
                    sx={{ mt: 1 }}
                />
            </Box>

            <Box>
                <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter your shipping address"
                    {...register("delivery_address", { required: "Address is required" })}
                    error={!!errors.delivery_address}
                    helperText={errors.delivery_address?.message as string}
                    sx={{ mt: 1 }}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
                <Button onClick={onCancel} disabled={isUpdating} sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isUpdating} 
                    sx={{ bgcolor: '#0f172a', borderRadius: '8px', px: 4, textTransform: 'none', fontWeight: 600 }}
                >
                    {isUpdating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}