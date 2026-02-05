"use client";

import { useState, useMemo } from 'react';
import { DataGrid, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import { Box, Typography, useMediaQuery, useTheme, Stack, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { getProductColumns } from './columns';
import ProductDetailsModal from '@/app/components/products/ProductDetailsModal';
import { ActionMenu, DeleteDialog } from '@/app/components/products/table/ProductActions';
import { deleteProductAction } from '@/app/actions/products';

interface ProductsTableProps {
    rows: any[];
    loading: boolean;
    rowCount: number;
    paginationModel: { page: number; pageSize: number };
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
    sortModel: GridSortModel;
    onSortChange: (model: GridSortModel) => void;
    onRefresh: () => void;
    userRole: string | null;
}

export default function ProductsTable(props: ProductsTableProps) {
    const {
        rows, loading, rowCount, paginationModel,
        onPaginationModelChange, sortModel, onSortChange, onRefresh, userRole
    } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const apiRef = useGridApiRef();
    const isAdmin = userRole === 'ADMIN';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleAction = (action: 'view' | 'edit' | 'delete') => {
        if (action === 'delete') {
            setDeleteDialogOpen(true);
        } else {
            setModalMode(action);
            setModalOpen(true);
        }
        handleMenuClose();
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        try {
            const result = await deleteProductAction(selectedId);
            if (result.success) {
                toast.success('Product deleted successfully');
                setDeleteDialogOpen(false);
                onRefresh();
            } else {
                toast.error(result.message || 'Failed to delete');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    const columns = useMemo(() => getProductColumns(handleMenuOpen, userRole), [userRole]);

    return (
        <Box sx={{ mt: 3 }}>
            {isMobile ? (
                <Stack spacing={2}>
                    {rows.length === 0 && !loading ? (
                        <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            No products found
                        </Typography>
                    ) : (
                        rows.map((product) => (<Box
                            key={product.id}
                            sx={{
                                p: 2,
                                bgcolor: 'white',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Box>
                                <Typography fontWeight={700}>{product.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ${Number(product.unit_price).toFixed(2)}
                                </Typography>
                            </Box>
                            {isAdmin && (
                                <IconButton size="small" onClick={(e) => handleMenuOpen(e, product.id)}>
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                        ))
                    )}
                </Stack>
            ) : (
                <Box sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Product Catalog</Typography>
                        <Typography variant="body2" color="textSecondary">{rowCount} products total</Typography>
                    </Box>
                    <DataGrid
                        apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        sortingMode="server"
                        sortModel={sortModel}
                        onSortModelChange={onSortChange}
                        disableColumnMenu
                        disableColumnFilter
                        disableColumnSelector
                        disableRowSelectionOnClick
                        paginationMode="server"
                        rowCount={rowCount}
                        loading={loading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={onPaginationModelChange}
                        pageSizeOptions={[10, 20, 50]}
                        sx={{
                            border: 'none',
                            px: 2,
                            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                                outline: 'none',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 700,
                                color: '#475569'
                            },
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none'
                            }
                        }}
                    />
                </Box>
            )}

            {isAdmin && (
                <>
                    <ActionMenu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        onView={() => handleAction('view')}
                        onEdit={() => handleAction('edit')}
                        onDelete={() => handleAction('delete')}
                        productId={selectedId} // Add this line
                    />
                    <DeleteDialog
                        open={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                        onConfirm={handleConfirmDelete}
                    />
                </>
            )}

            <ProductDetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                productId={selectedId}
                initialMode={modalMode}
                onSuccess={() => {
                    onRefresh();
                    setModalOpen(false);
                }}
            />
        </Box>
    );
}