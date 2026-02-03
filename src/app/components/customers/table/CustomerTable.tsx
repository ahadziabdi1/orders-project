"use client";

import { useState, useMemo } from 'react';
import { DataGrid, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import {
    Box, Typography, useMediaQuery, useTheme, Stack, IconButton
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { getCustomerColumns } from '@/app/components/customers/table/columns';
import { deleteCustomerAction } from '@/app/actions/customers';
import { ActionMenu, DeleteDialog } from '@/app/components/customers/table/CustomerActions';
import CustomerDetailsModal from '@/app/components/customers/CustomerDetailsModal';

interface CustomersTableProps {
    rows: any[];
    loading: boolean;
    rowCount: number;
    paginationModel: { page: number; pageSize: number };
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
    sortModel: GridSortModel;
    onSortChange: (model: GridSortModel) => void;
    onRefresh: () => void;
}

export default function CustomersTable(props: CustomersTableProps) {
    const {
        rows, loading, rowCount, paginationModel,
        onPaginationModelChange, sortModel, onSortChange, onRefresh
    } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const apiRef = useGridApiRef();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action: 'view' | 'edit' | 'delete') => {
        handleMenuClose();
        if (action === 'delete') {
            setDeleteDialogOpen(true);
        } else {
            setModalMode(action);
            setModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;

        try {
            const result = await deleteCustomerAction(selectedId);
            if (result.success) {
                toast.success(result.message || 'Customer deleted successfully');
                setDeleteDialogOpen(false);
                setSelectedId(null);
                onRefresh();
            } else {
                toast.error(result.message || 'Failed to delete customer');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedId(null);
    };

    const columns = useMemo(() => getCustomerColumns(handleMenuOpen), []);

    return (
        <Box sx={{ mt: 3 }}>
            {isMobile ? (
                <Stack spacing={2}>
                    {rows.length === 0 && !loading ? (
                        <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            No customers found
                        </Typography>
                    ) : (
                        rows.map((customer) => (
                            <Box key={customer.id} sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography fontWeight={700}>{customer.full_name}</Typography>
                                    <Typography variant="body2" color="textSecondary">{customer.email}</Typography>
                                </Box>
                                <IconButton size="small" onClick={(e) => handleMenuOpen(e, customer.id)}>
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            </Box>
                        ))
                    )}
                </Stack>
            ) : (
                <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Customers</Typography>
                        <Typography variant="body2" color="textSecondary">{rowCount} customers total</Typography>
                    </Box>
                    <DataGrid
                        apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        rowCount={rowCount}
                        loading={loading}
                        sortingMode="server"
                        sortModel={sortModel}
                        onSortModelChange={onSortChange}
                        disableColumnMenu
                        disableColumnFilter
                        disableColumnSelector
                        disableRowSelectionOnClick
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={onPaginationModelChange}
                        pageSizeOptions={[10, 20, 50]}
                        sx={{
                            border: 'none', px: 2,
                            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
                            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, color: '#475569' },
                            '& .MuiDataGrid-cell:focus': { outline: 'none' }
                        }}
                    />
                </Box>
            )}

            <ActionMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onView={() => handleAction('view')}
                onEdit={() => handleAction('edit')}
                onDelete={() => handleAction('delete')}
                customerId={selectedId} 
            />

            <CustomerDetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                customerId={selectedId}
                initialMode={modalMode}
                onRefresh={onRefresh}
            />

            <DeleteDialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
}