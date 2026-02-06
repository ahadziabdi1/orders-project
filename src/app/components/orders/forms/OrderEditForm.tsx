import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, MenuItem, Button, CircularProgress, Autocomplete } from '@mui/material';
import { PersonOutline, ShoppingBagOutlined, NumbersOutlined, PaidOutlined, HomeOutlined, LocalOfferOutlined } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import { updateOrderAction } from '@/app/actions/orders';
import { Order, OrderFormData, OrderStatus, Product, Customer } from '@/app/types/types';
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

interface Props {
    order: Order;
    products: Product[];
    customers: Customer[];
    onCancel: () => void;
    onSuccess: () => void;
    userRole?: string | null;
}

export default function OrderEditForm({ order, products, customers, onCancel, onSuccess, userRole }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);

    const isAdmin = userRole === 'ADMIN';

    const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm<OrderFormData>({
        defaultValues: {
            customer_uuid: order.customer_uuid,
            product_id: order.product_id,
            quantity: order.quantity,
            total_price: order.total_price,
            delivery_address: order.delivery_address,
            status: order.status
        }
    });

    const watchProductId = watch('product_id');
    const watchQuantity = watch('quantity');

    useEffect(() => {
        const product = products.find(p => p.id === watchProductId);
        if (product) {
            setValue('total_price', product.unit_price * (watchQuantity || 0));
        }
    }, [watchProductId, watchQuantity, products, setValue]);

    const handleUpdate = async (formData: OrderFormData) => {
        setIsUpdating(true);
        try {
            const result = await updateOrderAction(order.id, formData);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message || "Update failed.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleUpdate)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                    <LabelWithIcon icon={PersonOutline} label="Customer" />
                    {(() => {
                        const currentCustomerId = order.customer_uuid || (order as any).customer_id;
                        const selectedCustomer = customers.find((c: any) =>
                            c.id == currentCustomerId || c.customer_uuid == currentCustomerId
                        );
                        return (
                            <TextField
                                fullWidth
                                disabled
                                value={selectedCustomer ? selectedCustomer.full_name : "Customer not found"}
                                sx={{
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor: "#0f172a",
                                        fontWeight: 700
                                    },
                                    bgcolor: '#f8fafc'
                                }}
                            />
                        );
                    })()}
                    <input type="hidden" {...register("customer_uuid")} />
                </Box>

                <Box>
                    <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                    <Controller
                        name="product_id"
                        control={control}
                        rules={{ required: "Please select a product" }}
                        render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                                {...field}
                                options={products}
                                getOptionLabel={(o) => o.name ? `${o.name} ($${o.unit_price})` : ""}
                                value={products.find(p => p.id === field.value) || null}
                                onChange={(_, data) => {
                                    field.onChange(data ? data.id : null);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={!!error}
                                        helperText={error?.message}
                                        placeholder="Select a product"
                                    />
                                )}
                            />
                        )}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={NumbersOutlined} label="Quantity" />
                    <TextField
                        fullWidth
                        type="number"
                        {...register("quantity", {
                            required: "Quantity is required",
                            min: { value: 1, message: "Quantity must be at least 1" },
                            valueAsNumber: true
                        })}
                        slotProps={{
                            input: { inputProps: { min: 1 } }
                        }}
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                    />
                </Box>

                <Box>
                    <LabelWithIcon icon={PaidOutlined} label="Total Price ($)" />
                    <TextField
                        fullWidth
                        disabled
                        value={watch('total_price')?.toFixed(2)}
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#0f172a",
                                fontWeight: 700
                            },
                            bgcolor: '#f8fafc'
                        }}
                    />
                </Box>
            </Box>

            <Box>
                <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    disabled={isUpdating}
                    placeholder="Enter delivery address"
                    {...register("delivery_address", {
                        required: "Address is required",
                        minLength: { value: 2, message: "Address is too short" }
                    })}
                    error={!!errors.delivery_address}
                    helperText={errors.delivery_address?.message}
                    sx={{ mt: 1 }}
                />
            </Box>

            <Box>
                <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            select={isAdmin}
                            disabled={isUpdating || !isAdmin}
                            {...field}
                            sx={{
                                mt: 1,
                                "& .MuiInputBase-input.Mui-disabled": !isAdmin ? {
                                    WebkitTextFillColor: "#0f172a",
                                    fontWeight: 700,
                                } : {},
                                "& .MuiOutlinedInput-root.Mui-disabled": !isAdmin ? {
                                    bgcolor: '#f8fafc',
                                    "& fieldset": { border: '1px solid #e2e8f0' }
                                } : {}
                            }}
                        >
                            {isAdmin ? (
                                (['CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'] as OrderStatus[]).map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))
                            ) : null}
                        </TextField>
                    )}
                />
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
        </Box >
    );
}