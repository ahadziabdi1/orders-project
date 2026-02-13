"use client";

import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { DataGrid, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import { Button, TextField, InputAdornment, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Box, Typography, useMediaQuery, useTheme, Stack } from '@mui/material';
import { toast } from 'react-hot-toast';

import { Customer, Order, Product } from '@/app/types/types';
import { getColumns } from '@/app/components/orders/table/columns';
import { TableFilters } from '@/app/components/orders/table/TableFilters';
import { OrderMobileCard } from '@/app/components/orders/table/OrderMobileCard';
import { ActionMenu, DeleteDialog } from '@/app/components/orders/table/OrderActions';
import { deleteOrderAction } from '@/app/actions/orders';
import OrderDetailsModal from '@/app/components/orders/OrderDetailsModal';
import AIChatPanel from '@/app/components/chat/AIChatPanel';

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
  userRole: string | null;
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
    onSortChange,
    userRole
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const apiRef = useGridApiRef();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) setProducts(pData);

      const { data: cData } = await supabase.from('customers').select('*');
      if (cData) setCustomers(cData);
    };
    fetchData();
  }, []);

  const handleAiAdd = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/generate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          products: products.map(p => ({ id: p.id, name: p.name, price: p.unit_price })),
          customers: customers.map(c => ({ id: c.customer_uuid, name: c.full_name }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error(errorData.error || 'AI Error');
      }

      const result = await response.json();
      const aiData = result.object;

      if (aiData.product_id === 'NOT_FOUND' || aiData.customer_uuid === 'NOT_FOUND') {
        const missingItem = aiData.product_id === 'NOT_FOUND' ? 'product' : 'customer';
        toast.error(`AI could not find a matching ${missingItem} in the database.`);
        setIsAiLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          product_id: aiData.product_id,
          customer_uuid: aiData.customer_uuid,
          quantity: aiData.quantity || 1,
          total_price: aiData.total_price,
          status: 'CREATED',
          delivery_address: aiData.address || 'AI Generated Address',
        }])
        .select(`*, products (name, unit_price), customers (full_name)`)
        .single();

      if (error) throw error;

      toast.success("AI: Order created successfully!");
      setAiPrompt('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Full error details:", err);
      toast.error("AI failed to process the request.");
    } finally {
      setIsAiLoading(false);
    }
  };

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
        toast.success(result.message || 'Order deleted successfully!');
        setDeleteDialogOpen(false);
        setSelectedOrderId(null);
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.message || 'Failed to delete order.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  const columns = useMemo(() => {
    const baseColumns = getColumns(handleMenuOpen, products, customers);

    return baseColumns.map((col) => {
      const isAlwaysReadonly = ['actions', 'id', 'created_at'].includes(col.field);

      return {
        ...col,
        editable: !isAlwaysReadonly && userRole === 'ADMIN',
      };
    });
  }, [userRole, handleMenuOpen, products, customers]);

  const processRowUpdate = async (newRow: Order, oldRow: Order) => {
    if (userRole !== 'ADMIN') return oldRow;

    const updateData = {
      product_id: newRow.product_id,
      status: newRow.status,
      delivery_address: newRow.delivery_address,
      quantity: newRow.quantity,
      customer_uuid: newRow.customer_uuid,
      total_price: newRow.total_price
    };

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', newRow.id);

    if (error) {
      toast.error("Failed to update.");
      return oldRow;
    }

    toast.success("Order updated.");
    return newRow;
  };

  const handleQuickAdd = async () => {
    const defaultProduct = products[0];
    const defaultCustomer = customers[0];

    if (!defaultProduct || !defaultCustomer) {
      toast.error("Loading products and customers, please wait...");
      return;
    }

    const newOrder = {
      product_id: defaultProduct.id,
      customer_uuid: defaultCustomer.customer_uuid,
      quantity: 1,
      total_price: defaultProduct.unit_price,
      status: 'CREATED',
      delivery_address: 'New Address...',
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select(`
        *,
        products (name, unit_price),
        customers (full_name)
      `)
      .single();

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("New order added successfully!");

      if (onRefresh) onRefresh();

      setTimeout(() => {
        apiRef.current.scrollToIndexes({ rowIndex: 0 });
        apiRef.current.startCellEditMode({ id: data.id, field: 'product_name' });
      }, 800);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TableFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) => onFilterChange(e.target.value, statusFilter)}
        onStatusChange={(newStatus) => onFilterChange(searchTerm, newStatus)}
        onReset={() => onFilterChange('', 'ALL')}
        userRole={userRole || ''}
      />

      <AIChatPanel tableData={rows} />

      {userRole === 'ADMIN' && (
        <Box sx={{
          display: 'flex',
          gap: 1,
          mb: 3,
          p: 2,
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px dashed #cbd5e1'
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="AI Quick Add: 'John bought 2 laptops, address 123 Street'..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiAdd()}
            disabled={isAiLoading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AutoAwesomeIcon sx={{ color: '#7c3aed' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ backgroundColor: 'white' }}
          />
          <Button
            variant="contained"
            onClick={handleAiAdd}
            disabled={isAiLoading || !aiPrompt.trim()}
            sx={{
              textTransform: 'none',
              minWidth: '120px',
              backgroundColor: '#8b5cf6',
              '&:hover': { backgroundColor: '#7c3aed' }
            }}
          >
            {isAiLoading ? <CircularProgress size={20} color="inherit" /> : 'AI Add'}
          </Button>
        </Box>
      )}

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
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {userRole === 'ADMIN' ? 'All Orders' : 'My Orders'}
              </Typography>
              <Typography variant="body2" color="textSecondary">{rowCount} orders found</Typography>
            </Box>

            {userRole === 'ADMIN' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleQuickAdd}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
              >
                Quick Add Row
              </Button>
            )}
          </Box>

          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.log(error)}
            onCellClick={(params) => {
              if (userRole === 'ADMIN' && params.isEditable && params.cellMode === 'view') {
                apiRef.current.startCellEditMode({ id: params.id, field: params.field });
              }
            }}
            onCellEditStop={(params) => {
              if (params.field === 'quantity') {
                setTimeout(() => {
                  const editValue = apiRef.current.getCellValue(params.id, 'quantity');
                  const currentRow = apiRef.current.getRow(params.id);

                  const product = products.find(p => p.id === currentRow.product_id);

                  if (product && editValue) {
                    const newTotal = product.unit_price * Number(editValue);

                    apiRef.current.setEditCellValue({
                      id: params.id,
                      field: 'total_price',
                      value: newTotal
                    });
                  }
                }, 0);
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
        userRole={userRole}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}