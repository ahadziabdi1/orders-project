"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import OrdersTable from '@/app/components/OrderTable';
import OrderForm from '@/app/components/OrderForm';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchOrders = useCallback(async (search?: string, status?: string) => {
        let query = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (search) {
            query = query.ilike('customer_name', `%${search}%`);
        }

        if (status && status !== 'ALL') {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (!error && data) {
            const formatted = data.map(o => ({
                ...o,
                total_amount: o.quantity * o.price_per_unit
            }));
            setOrders(formatted);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleFilterChange = (search: string, status: string) => {
        setSearchTerm(search);
        setStatusFilter(status);
        fetchOrders(search, status);
    };

    return (
        <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 6 }, backgroundColor: '#fdfdfd' }}>
            <Container maxWidth="lg">
                <Box sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                            Orders Management
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Manage and track your customer orders.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsModalOpen(true)}
                        fullWidth={false}
                        sx={{
                            backgroundColor: '#0f172a',
                            color: '#fff',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': {
                                backgroundColor: '#1e293b',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                        }}
                    >
                        Add New Order
                    </Button>
                </Box>

                <OrdersTable
                    rows={orders}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onFilterChange={handleFilterChange}
                    onRefresh={() => fetchOrders(searchTerm, statusFilter)}
                />

                <Dialog
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
                            Create New Order
                        </DialogTitle>
                        <IconButton onClick={() => setIsModalOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent sx={{ pt: 0 }}>
                        <OrderForm onClose={() => {
                            setIsModalOpen(false);
                            fetchOrders(searchTerm, statusFilter);
                        }} />
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
}