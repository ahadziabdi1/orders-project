"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, CircularProgress, Box, IconButton, Typography, Chip, Divider } from '@mui/material';
import { Close } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import { Order, Product, Customer, getStatusColor } from '@/app/types/types';

import OrderView from '@/app/components/orders/OrderView';
import OrderEditForm from '@/app/components/orders/forms/OrderEditForm';

interface OrderDetailsModalProps {
    open: boolean;
    onClose: () => void;
    orderId: string | null;
    initialMode: 'view' | 'edit';
    onSuccess?: () => void;
    userRole: string | null;
}

export default function OrderDetailsModal({
    open,
    onClose,
    orderId,
    initialMode,
    onSuccess,
    userRole
}: OrderDetailsModalProps) {
    const [mode, setMode] = useState(initialMode);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const fetchInitialData = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const [orderRes, prodRes, custRes] = await Promise.all([
                supabase.from('orders').select(`*, customers (full_name), products (name)`).eq('id', orderId).single(),
                supabase.from('products').select('*'),
                supabase.from('customers').select('*')
            ]);

            setProducts(prodRes.data || []);
            setCustomers(custRes.data || []);

            if (orderRes.data) {
                setOrder({
                    ...orderRes.data,
                    customer_name: orderRes.data.customers?.full_name || 'Unknown',
                    product_name: orderRes.data.products?.name || 'Unknown'
                });
            }
        } catch (err) {
            toast.error("Failed to load order data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && orderId) {
            setMode(initialMode);
            fetchInitialData();
        }
    }, [open, orderId, initialMode]);

    const shortId = orderId?.substring(0, 8).toUpperCase();
    const statusStyle = order ? getStatusColor(order.status) : { bg: '#eee', text: '#333', border: '#ccc' };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="body" slotProps={{ paper: { sx: { borderRadius: '16px' } } }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#64748b', zIndex: 10 }}>
                <Close />
            </IconButton>

            <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: '#0f172a' }} /></Box>
                ) : (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, pr: 4 }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    {mode === 'edit' ? "Edit Order" : "Order Details"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
                                    ID: <span style={{ color: '#0f172a' }}>#{shortId}</span>
                                </Typography>
                            </Box>
                            <Chip label={order?.status} sx={{ fontWeight: 700, bgcolor: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`, borderRadius: '6px' }} />
                        </Box>
                        <Divider sx={{ mb: 4 }} />

                        {mode === 'edit' ? (
                            <OrderEditForm
                                order={order!}
                                userRole={userRole || ''}
                                products={products}
                                customers={customers}
                                onCancel={() => setMode('view')}
                                onSuccess={() => {
                                    fetchInitialData();
                                    setMode('view');
                                    onSuccess?.();
                                }}
                            />
                        ) : (
                            <OrderView order={order!} onEdit={() => setMode('edit')} onClose={onClose} />
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}