"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
    Container, Paper, Typography, Button, Box, TextField, 
    MenuItem, CircularProgress, SxProps, Theme, Divider 
} from '@mui/material';
import { 
    PersonOutline, ShoppingBagOutlined, NumbersOutlined, 
    PaidOutlined, LocalOfferOutlined, HomeOutlined 
} from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import { updateOrderAction } from '@/app/actions/orders';

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

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();

            if (!error) {
                setOrder(data);
            } else {
                toast.error("Error loading order details");
            }
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        const formDataRaw = new FormData(e.currentTarget);
        
        const dataToUpdate = {
            customer_name: formDataRaw.get('customer_name'),
            product_name: formDataRaw.get('product_name'),
            quantity: formDataRaw.get('quantity'),
            price_per_unit: formDataRaw.get('price_per_unit'),
            delivery_address: formDataRaw.get('delivery_address'),
            status: formDataRaw.get('status'),
        };

        const result = await updateOrderAction(id as string, dataToUpdate);

        if (result.success) {
            toast.success(result.message);
            router.push('/orders');
        } else {
            toast.error(result.message || "Update failed");
        }
        setIsUpdating(false);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    if (!order) return (
        <Container sx={{ mt: 5 }}>
            <Typography color="error">Order with ID {id} not found.</Typography>
            <Button onClick={() => router.push('/orders')}>Back to List</Button>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" fontWeight={800} color="#0f172a">
                        {isEditMode ? "Edit Order" : "Order Details"} 
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={() => isEditMode ? router.push(`/orders/${id}`) : router.push('/orders')}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                    >
                        {isEditMode ? "Cancel" : "Back"}
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {isEditMode ? (
                    <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Box>
                            <LabelWithIcon icon={PersonOutline} label="Customer Name" />
                            <TextField 
                                fullWidth name="customer_name" required
                                defaultValue={order.customer_name} 
                            />
                        </Box>

                        <Box>
                            <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                            <TextField 
                                fullWidth name="product_name" required
                                defaultValue={order.product_name} 
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <LabelWithIcon icon={NumbersOutlined} label="Quantity" />
                                <TextField 
                                    fullWidth name="quantity" type="number" required
                                    defaultValue={order.quantity} 
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <LabelWithIcon icon={PaidOutlined} label="Unit Price" />
                                <TextField 
                                    fullWidth name="price_per_unit" type="number" required
                                    inputProps={{ step: "0.01" }}
                                    defaultValue={order.price_per_unit} 
                                />
                            </Box>
                        </Box>

                        <Box>
                            <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                            <TextField 
                                fullWidth name="delivery_address" required
                                defaultValue={order.delivery_address} 
                            />
                        </Box>

                        <Box>
                            <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                            <TextField
                                select fullWidth name="status"
                                defaultValue={order.status}
                            >
                                <MenuItem value="CREATED">CREATED</MenuItem>
                                <MenuItem value="PROCESSING">PROCESSING</MenuItem>
                                <MenuItem value="SHIPPED">SHIPPED</MenuItem>
                                <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                                <MenuItem value="CANCELED">CANCELED</MenuItem>
                            </TextField> 
                        </Box>

                        <Box sx={{ mt: 1 }}>
                            <Button 
                                type="submit" variant="contained" fullWidth disabled={isUpdating}
                                sx={{ backgroundColor: '#0f172a', py: 1.5, borderRadius: '8px', fontWeight: 600, textTransform: 'none' }}
                            >
                                {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Save Changes"} 
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            <Box>
                                <LabelWithIcon icon={PersonOutline} label="Customer" />
                                <Typography variant="h6" fontWeight={600}>{order.customer_name}</Typography> 
                            </Box>
                            <Box>
                                <LabelWithIcon icon={ShoppingBagOutlined} label="Product" />
                                <Typography variant="h6" fontWeight={600}>{order.product_name}</Typography> 
                            </Box>
                            <Box>
                                <LabelWithIcon icon={LocalOfferOutlined} label="Status" />
                                <Typography variant="h6" fontWeight={600} sx={{ color: '#2563eb' }}>{order.status}</Typography> 
                            </Box>
                            <Box>
                                <LabelWithIcon icon={PaidOutlined} label="Total Amount" />
                                <Typography variant="h6" fontWeight={600}>
                                    ${(order.quantity * order.price_per_unit).toFixed(2)}
                                </Typography> 
                            </Box>
                        </Box>
                        <Box>
                            <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                            <Typography variant="body1">{order.delivery_address}</Typography> 
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button 
                                variant="contained" 
                                onClick={() => router.push(`/orders/${id}?edit=true`)}
                                sx={{ backgroundColor: '#0f172a', textTransform: 'none', px: 4, borderRadius: '8px' }}
                            >
                                Edit Order Information
                            </Button> 
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}