import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { Inventory2Outlined, PaidOutlined } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import { updateProductAction } from '@/app/actions/products';
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

export default function ProductEditForm({ product, onCancel, onSuccess }: { product: any, onCancel: () => void, onSuccess: () => void }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: product.name,
            unit_price: product.unit_price,
            description: product.description,
            category: product.category,
            stock_quantity: product.stock_quantity
        }
    });

    const handleUpdate = async (formData: any) => {
        setIsUpdating(true);
        try {
            const result = await updateProductAction(product.id, formData);

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
        <Box component="form" onSubmit={handleSubmit(handleUpdate)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                    <LabelWithIcon icon={Inventory2Outlined} label="Product Name" />
                    <TextField
                        fullWidth
                        {...register("name", { required: "Name is required" })}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                        sx={{ mt: 1 }}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={PaidOutlined} label="Price ($)" />
                    <TextField
                        fullWidth
                        type="number"
                        {...register("unit_price", {
                            required: "Price is required",
                            min: {
                                value: 1,
                                message: "Price must be greater than 1"
                            },
                            valueAsNumber: true
                        })}
                        error={!!errors.unit_price}
                        helperText={errors.unit_price?.message as string}
                        slotProps={{
                            input: { inputProps: { min: 1, step: 0.01 } }
                        }}
                        sx={{ mt: 1 }}
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                <Button onClick={onCancel} disabled={isUpdating} sx={{ color: '#64748b', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isUpdating} sx={{
                    bgcolor: '#0f172a',
                    '&:hover': { bgcolor: '#1e293b' },
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 4,
                    fontWeight: 600
                }}>
                    {isUpdating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}