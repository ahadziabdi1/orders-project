"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import { DataGrid, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import { Box, Typography, useMediaQuery, useTheme, Stack } from '@mui/material';
import { toast } from 'react-hot-toast';

import { Order } from '@/app/types/orders';
import { getColumns } from '@/app/components/orders/table/columns';
import { TableFilters } from '@/app/components/orders/table/TableFilters';
import { OrderMobileCard } from '@/app/components/orders/table/OrderMobileCard';
import { ActionMenu, DeleteDialog } from '@/app/components/orders/table/OrderActions';
import { deleteOrderAction } from '@/app/actions/orders';
import OrderDetailsModal from '@/app/components/orders/OrderDetailsModal';

import { supabase } from '@/lib/supabaseClient';

interface OrdersTableProps {
  rows: Order[];
  searchTerm: string;
  statusFilter: string;
  onFilterChange: (search: string, status: string) => void;
  onRefresh?: () => void;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  rowCount: number;
  loading: boolean;
  sortModel: GridSortModel;
  onSortChange: (model: GridSortModel) => void;
}

export default function OrdersTable(props: OrdersTableProps) {
  const {
    rows,
    searchTerm,
    statusFilter,
    onFilterChange,
    onRefresh,
    paginationModel,
    onPaginationModelChange,
    rowCount,
    loading,
    sortModel,
    onSortChange
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const apiRef = useGridApiRef();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDetails = (mode: 'view' | 'edit') => {
    setModalMode(mode);
    setDetailsModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrderId) return;
    try {
      const result = await deleteOrderAction(selectedOrderId);
      if (result.success) {
        toast.success(result.message || 'Order deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedOrderId(null);
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.message || 'Failed to delete order');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  const columns = useMemo(() => getColumns(handleMenuOpen), []);

  const processRowUpdate = async (newRow: Order, oldRow: Order) => {
    if (newRow.status === oldRow.status) return oldRow;

    const { error } = await supabase
      .from('orders')
      .update({ status: newRow.status })
      .eq('id', newRow.id);

    if (error) {
      toast.error("Failed to update status");
      return oldRow;
    }

    toast.success("Order status updated.");
    return newRow;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TableFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) => onFilterChange(e.target.value, statusFilter)}
        onStatusChange={(newStatus) => onFilterChange(searchTerm, newStatus)}
        onReset={() => onFilterChange('', 'ALL')}
      />

      {isMobile ? (
        <Stack spacing={2}>
          {rows.length === 0 ? (
            <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>No orders found</Typography>
          ) : (
            rows.map((order) => (
              <OrderMobileCard
                key={order.id}
                order={order}
                onMenuOpen={handleMenuOpen}
              />
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
            <Typography variant="h6" sx={{ fontWeight: 800 }}>All Orders</Typography>
            <Typography variant="body2" color="textSecondary">{rowCount} orders found</Typography>
          </Box>
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.log(error)}
            onCellClick={(params) => {
              if (params.field === 'status' && params.colDef.editable) {
                if (params.cellMode === 'view') {
                  apiRef.current.startCellEditMode({ id: params.id, field: params.field });
                }
              }
            }}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={onSortChange}
            paginationMode="server"
            rowCount={rowCount}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={[10, 20, 50]}
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              px: 2,
              '& .MuiDataGrid-cell--editing': {
                padding: '0 !important',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent !important',
              },
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                color: '#475569'
              },
              '& .MuiDataGrid-sortIcon': {
                opacity: '1 !important',
                color: '#cbd5e1 !important',
              },
              '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Box>
      )}

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        orderId={selectedOrderId}
        onView={() => handleOpenDetails('view')}
        onEdit={() => handleOpenDetails('edit')}
        onDelete={() => { setDeleteDialogOpen(true); handleMenuClose(); }}
      />

      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        orderId={selectedOrderId}
        initialMode={modalMode}
        onSuccess={onRefresh}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}