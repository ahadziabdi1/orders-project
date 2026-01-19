"use client";

import { useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, useMediaQuery, useTheme, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Order } from './orders-table/types';
import { getColumns } from './orders-table/columns';
import { TableFilters } from './orders-table/TableFilters';
import { OrderMobileCard } from './orders-table/OrderMobileCard';
import { ActionMenu, DeleteDialog } from './orders-table/OrderActions';

import { deleteOrderAction } from '@/app/actions/orders';

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
}

export default function OrdersTable(props: OrdersTableProps) {
  const {
    rows, searchTerm, statusFilter, onFilterChange, onRefresh,
    paginationModel, onPaginationModelChange, rowCount, loading
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const processedRows = useMemo(() =>
    rows.map(order => ({
      ...order,
      total_amount: order.total_amount || (order.quantity * order.price_per_unit)
    })), [rows]
  );

  return (
    <Box sx={{ mt: 3 }}>
      <TableFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={(e) => onFilterChange(e.target.value, statusFilter)}
        onStatusChange={(newStatus) => onFilterChange(searchTerm, newStatus)}
        onReset={() => onFilterChange('', 'ALL')}
      />

      {isMobile ? (
        <Stack spacing={2}>
          {processedRows.length === 0 ? (
            <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>No orders found</Typography>
          ) : (
            processedRows.map((order) => (
              <OrderMobileCard
                key={order.id}
                order={order}
                onMenuOpen={handleMenuOpen}
              />
            ))
          )}
        </Stack>
      ) : (
        <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>All Orders</Typography>
            <Typography variant="body2" color="textSecondary">{rowCount} orders found</Typography>
          </Box>
          <DataGrid
            rows={processedRows}
            columns={columns}
            paginationMode="server"
            rowCount={rowCount}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={[10, 20, 50]}
            autoHeight
            disableRowSelectionOnClick
            sx={{ border: 'none', px: 2 }}
          />
        </Box>
      )}

      <ActionMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        orderId={selectedOrderId}
        onDelete={() => { setDeleteDialogOpen(true); handleMenuClose(); }}
        router={router}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}