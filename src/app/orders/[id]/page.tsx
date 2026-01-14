"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabaseClient';
import {
    Container, Paper, Typography, Button, Box, TextField,
    MenuItem, CircularProgress, SxProps, Theme, Divider, Chip, IconButton
} from '@mui/material';
import {
    PersonOutline, ShoppingBagOutlined, NumbersOutlined,
    PaidOutlined, LocalOfferOutlined, HomeOutlined, ArrowBackIosNew
} from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import { updateOrderAction } from '@/app/actions/orders';

type OrderFormData = {
    product_name: string;
    customer_name: string;
    quantity: number;
    price_per_unit: number;
    delivery_address: string;
    status: string;
};

const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'CREATED':
            return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' };
        case 'PROCESSING':
            return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: 'rgba(245, 158, 11, 0.2)' };
        case 'SHIPPED':
            return { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed', border: 'rgba(139, 92, 246, 0.2)' };
        case 'DELIVERED':
            return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.2)' };
        case 'CANCELED':
            return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' };
        default:
            return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };
    }
};

const LabelWithIcon = ({ icon: Icon, label }: { icon: React.ElementType<{ sx?: SxProps<Theme> }>, label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
            {label}
        </Typography>
    </Box>
);

export default function OrderDetailsPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isEditMode = searchParams.get('edit') === 'true';

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        setValue
    } = useForm<OrderFormData>({
        defaultValues: {
            customer_name: '',
            product_name: '',
            quantity: 1,
            price_per_unit: 0,
            delivery_address: '',
            status: 'CREATED'
        }
    });

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
            if (!error && data) {
                setOrder(data);
                setValue('customer_name', data.customer_name || '');
                setValue('product_name', data.product_name || '');
                setValue('quantity', data.quantity || 1);
                setValue('price_per_unit', data.price_per_unit || 0);
                setValue('delivery_address', data.delivery_address || '');
                setValue('status', data.status || 'CREATED');
            } else {
                toast.error("Error loading order details");
            }
            setLoading(false);
        };
        
        if (id) {
            fetchOrder();
        }
    }, [id, setValue]);

    const handleUpdate = async (data: OrderFormData) => {
        setIsUpdating(true);
        
        try {
            const result = await updateOrderAction(id as string, data);
            if (result.success) {
                toast.success(result.message);
                router.push(`/orders/${id}`);
            } else {
                toast.error(result.message || "Update failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        if (order) {
            reset({
                customer_name: order.customer_name,
                product_name: order.product_name,
                quantity: order.quantity,
                price_per_unit: order.price_per_unit,
                delivery_address: order.delivery_address,
                status: order.status
            });
        }
        router.push(`/orders/${id}`);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress sx={{ color: '#0f172a' }} />
        </Box>
    );

    if (!order) return (
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 8 } }}>
            <Typography variant="h6" color="error">
                Order not found
            </Typography>
        </Container>
    );

    const shortOrderId = order.id.toString().substring(0, 7).toUpperCase();
    const statusStyle = getStatusColor(order.status);

    return (
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 8 } }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => router.push('/orders')} sx={{ color: '#0f172a' }}>
                    <ArrowBackIosNew sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#64748b', cursor: 'pointer', '&:hover': { color: '#0f172a' } }}
                    onClick={() => router.push('/orders')}
                >
                    Back to Orders
                </Typography>
            </Box>

            <Paper elevation={0} sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 4
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                            {isEditMode ? "Edit Order" : "Order Details"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
                            ID: <span style={{ color: '#0f172a', fontWeight: 700 }}>#{shortOrderId}</span>
                        </Typography>
                    </Box>
                    <Chip
                        label={order.status?.toUpperCase()}
                        sx={{
                            fontWeight: 700,
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                {isEditMode ? (
                    <Box component="form" onSubmit={handleSubmit(handleUpdate)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                            <Box>
                                <LabelWithIcon icon={PersonOutline} label="Customer Name" />
                                <TextField
                                    fullWidth
                                    disabled={isUpdating}
                                    placeholder="Enter customer name"
                                    {...register("customer_name", { 
                                        required: "Customer name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters"
                                        }
                                    })}
                                    error={!!errors.customer_name}
                                    helperText={errors.customer_name?.message}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                            <Box>
                                <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                                <TextField
                                    fullWidth
                                    disabled={isUpdating}
                                    placeholder="Enter product name"
                                    {...register("product_name", { 
                                        required: "Product name is required"
                                    })}
                                    error={!!errors.product_name}
                                    helperText={errors.product_name?.message}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                            <Box>
                                <LabelWithIcon icon={NumbersOutlined} label="Quantity" />
                                <TextField
                                    fullWidth
                                    type="number"
                                    disabled={isUpdating}
                                    inputProps={{ min: 1 }}
                                    {...register("quantity", { 
                                        required: "Quantity is required",
                                        min: {
                                            value: 1,
                                            message: "Quantity must be at least 1"
                                        },
                                        valueAsNumber: true
                                    })}
                                    error={!!errors.quantity}
                                    helperText={errors.quantity?.message}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                            <Box>
                                <LabelWithIcon icon={PaidOutlined} label="Unit Price" />
                                <TextField
                                    fullWidth
                                    type="number"
                                    disabled={isUpdating}
                                    inputProps={{ step: "0.01", min: 0 }}
                                    {...register("price_per_unit", { 
                                        required: "Price is required",
                                        min: {
                                            value: 0,
                                            message: "Price cannot be negative"
                                        },
                                        valueAsNumber: true
                                    })}
                                    error={!!errors.price_per_unit}
                                    helperText={errors.price_per_unit?.message}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                            <TextField
                                fullWidth
                                rows={3}
                                disabled={isUpdating}
                                placeholder="Enter full delivery address"
                                {...register("delivery_address", { 
                                    required: "Delivery address is required",
                                    minLength: {
                                        value: 5,
                                        message: "Address must be at least 5 characters"
                                    }
                                })}
                                error={!!errors.delivery_address}
                                helperText={errors.delivery_address?.message}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                        <Box>
                            <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                            <TextField 
                                select 
                                fullWidth 
                                defaultValue={order.status}
                                disabled={isUpdating}
                                {...register("status")}
                                sx={{ mt: 1 }}
                            >
                                {['CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'].map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                            <Button
                                onClick={handleCancel}
                                disabled={isUpdating}
                                sx={{ color: '#374151', textTransform: 'none', fontWeight: 600 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isUpdating}
                                sx={{ backgroundColor: '#0f172a', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, minWidth: '140px' }}
                            >
                                {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                            <DetailBlock icon={PersonOutline} label="Customer Name" value={order.customer_name} />
                            <DetailBlock icon={ShoppingBagOutlined} label="Product" value={order.product_name} />
                            <DetailBlock icon={NumbersOutlined} label="Quantity" value={order.quantity} />
                            <DetailBlock icon={PaidOutlined} label="Total Amount" value={`$${(order.quantity * order.price_per_unit).toFixed(2)}`} isHighlight />
                        </Box>
                        <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#334155', ml: { xs: 0, sm: 4 }, mt: 1 }}>
                                {order.delivery_address}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => router.push(`/orders/${id}?edit=true`)}
                            sx={{ backgroundColor: '#0f172a', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, width: { xs: '100%', sm: 'fit-content' } }}
                        >
                            Edit Order Information
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

function DetailBlock({ icon, label, value, isHighlight = false }: any) {
    return (
        <Box>
            <LabelWithIcon icon={icon} label={label} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: isHighlight ? '#0f172a' : '#1e293b', ml: { xs: 0, sm: 4 }, mt: 1 }}>
                {value}
            </Typography>
        </Box>
    );
}