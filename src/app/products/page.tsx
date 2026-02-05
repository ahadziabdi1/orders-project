"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import {
    Container,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { GridSortModel } from '@mui/x-data-grid';

import ProductForm from '@/app/components/products/forms/ProductForm';
import ProductsTable from '@/app/components/products/table/ProductTable';

export default function ProductsPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);

    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    setUserRole(profile?.role || 'USER');
                } else {
                    setUserRole('USER');
                }
            } catch (error) {
                console.error("Error retrieving role:", error);
                setUserRole('USER');
            } finally {
                setIsRoleLoading(false);
            }
        };
        getUserData();
    }, [supabase]);

    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['products', paginationModel, sortModel, userRole],
        enabled: !!userRole,
        queryFn: async () => {
            const from = paginationModel.page * paginationModel.pageSize;
            const to = from + paginationModel.pageSize - 1;

            let query = supabase.from('products').select('*', { count: 'exact' });

            if (sortModel.length > 0) {
                const { field, sort } = sortModel[0];
                query = query.order(field, { ascending: sort === 'asc' });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data: products, error, count } = await query.range(from, to);
            if (error) throw error;
            return { products, total: count || 0 };
        }
    });

    if (isRoleLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const isAdmin = userRole === 'ADMIN';

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
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>Product Catalog</Typography>
                        <Typography variant="body1" color="textSecondary">
                            {isAdmin
                                ? "Manage your system's product list and pricing."
                                : "View available products and their current prices."}
                        </Typography>
                    </Box>

                    {isAdmin && (
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
                            Add New Product
                        </Button>
                    )}
                </Box>

                <ProductsTable
                    rows={data?.products || []}
                    rowCount={data?.total || 0}
                    loading={isLoading || isRefetching}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    sortModel={sortModel}
                    onSortChange={setSortModel}
                    onRefresh={refetch}
                    userRole={userRole}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2, pt: 1 }}>
                        <DialogTitle sx={{ fontWeight: 800 }}>New Product</DialogTitle>
                        <IconButton onClick={() => setIsModalOpen(false)} size="small"><CloseIcon /></IconButton>
                    </Box>
                    <DialogContent sx={{ pt: 0 }}>
                        <ProductForm onClose={() => { setIsModalOpen(false); refetch(); }} />
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
}