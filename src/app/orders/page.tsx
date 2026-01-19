"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import {
    Container,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from '@mui/material';
import OrdersTable from '@/app/components/OrderTable';
import OrderForm from '@/app/components/OrderForm';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { GridSortModel } from '@mui/x-data-grid';

import { Order, OrderStatus } from '@/app/types/orders';

export default function OrdersPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: 'created_at', sort: 'desc' }
    ]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['orders', page, pageSize, searchTerm, statusFilter, sortModel],
        queryFn: async () => {
            const from = page * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('orders')
                .select('*', { count: 'exact' });

            if (sortModel.length > 0) {
                const { field, sort } = sortModel[0];
                query = query.order(field, { ascending: sort === 'asc' });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            if (searchTerm) {
                query = query.ilike('customer_name', `%${searchTerm}%`);
            }

            if (statusFilter !== 'ALL') {
                query = query.eq('status', statusFilter as OrderStatus);
            }

            query = query.range(from, to);

            const { data, error, count } = await query;
            if (error) throw error;

            const formatted: Order[] = (data || []).map((o) => ({
                id: o.id,
                product_name: o.product_name,
                customer_name: o.customer_name,
                quantity: o.quantity,
                price_per_unit: o.price_per_unit,
                delivery_address: o.delivery_address,
                status: o.status as OrderStatus,
                created_at: o.created_at,
                total_amount: o.quantity * o.price_per_unit
            }));

            return {
                orders: formatted,
                totalCount: count || 0
            };
        }
    });

    const handleFilterChange = (search: string, status: string) => {
        setSearchTerm(search);
        setStatusFilter(status);
        setPage(0);
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
                            Manage and track orders.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsModalOpen(true)}
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
                    rows={data?.orders ?? []}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onFilterChange={handleFilterChange}
                    onRefresh={refetch}
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    sortModel={sortModel}
                    onSortChange={(model) => setSortModel(model)}
                    rowCount={data?.totalCount ?? 0}
                    loading={isLoading}
                />

                <Dialog
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    slotProps={{
                        paper: {
                            sx: { borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', }
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
                            refetch();
                        }} />
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
}