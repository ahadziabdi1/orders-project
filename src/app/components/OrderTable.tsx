"use client";

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box, Chip, Typography, Card, CardContent, Stack, useMediaQuery,
  useTheme, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Menu, MenuItem, ListItemText, Divider,
  TextField, FormControl, InputLabel, Select, InputAdornment
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { deleteOrderAction } from '@/app/actions/orders';
import {
  DeleteOutline, EditOutlined, MoreVert,
  Launch, SearchOutlined
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  customer_name: string;
  product_name: string;
  delivery_address: string;
  status: string;
  created_at: string;
  total_amount: number;
  quantity: number;
  price_per_unit: number;
}

interface OrdersTableProps {
  rows: Order[];
  searchTerm: string;
  statusFilter: string;
  onFilterChange: (search: string, status: string) => void;
  onRefresh?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CREATED':
      return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' };
    case 'PROCESSING':
      return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: 'rgba(245, 158, 11, 0.2)' };
    case 'SHIPPED':
      return { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed', border: 'rgba(139, 92, 246, 0.2)' };
    case 'DELIVERED':
      return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.2)' };
    case 'CANCELED':
      return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' };
    default:
      return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };
  }
};

export default function OrdersTable({
  rows,
  searchTerm,
  statusFilter,
  onFilterChange,
  onRefresh
}: OrdersTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const openMenu = Boolean(anchorEl);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleDeleteClick = () => {
    setOrderToDelete(selectedOrderId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    try {
      const result = await deleteOrderAction(orderToDelete);
      if (result.success) {
        toast.success(result.message || 'Order deleted successfully');
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.message || 'Failed to delete order');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setLocalSearchTerm(newSearch);
    onFilterChange(newSearch, statusFilter);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    onFilterChange(localSearchTerm, newStatus);
  };

  const handleResetFilters = () => {
    setLocalSearchTerm('');
    onFilterChange('', 'ALL');
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Order ID',
      width: 120,
      resizable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
            #{params.value.toString().substring(0, 7).toUpperCase()}
          </Typography>
        </Box>
      )
    },
    {
      field: 'product_name',
      headerName: 'Product',
      minWidth: 220,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      minWidth: 180,
    },
    {
      field: 'delivery_address',
      headerName: 'Address',
      minWidth: 180,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      resizable: false,
      renderCell: (params) => {
        const style = getStatusColor(params.value);
        return (
          <Chip
            label={params.value?.toUpperCase()}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.65rem',
              width: '100%',
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
              borderRadius: '6px',
            }}
          />
        );
      }
    },
    {
      field: 'created_at',
      headerName: 'Date',
      width: 130,
      resizable: false,
      valueGetter: (value) => value ? new Date(value) : null,
      valueFormatter: (value) => {
        if (!value) return '';
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(value);
      },
    },
    {
      field: 'total_amount',
      headerName: 'Amount',
      width: 110,
      align: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '100%' }}>
          <Typography sx={{ fontWeight: 700 }}>
            ${params.value?.toFixed(2)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 50,
      sortable: false,
      resizable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row.id)}>
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (isMobile) {
    return (
      <Box sx={{ mt: 3 }}>
        {/* Zaglavlje za mobile */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{
            fontWeight: 800,
            color: '#0f172a',
            mb: 1
          }}>
            Orders
          </Typography>
          <Typography variant="body2" sx={{
            color: '#64748b',
            fontWeight: 500
          }}>
            Manage and filter your orders
          </Typography>
        </Box>

        {/* Filter Box za mobile */}
        <Card sx={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          mb: 4,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                placeholder="Search orders..."
                size="small"
                fullWidth
                value={localSearchTerm}
                onChange={handleSearchInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <SearchOutlined sx={{ color: '#64748b', fontSize: 20 }} />
                  </InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc'
                  }
                }}
              />

              <FormControl size="small" fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="CREATED">Created</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="SHIPPED">Shipped</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="CANCELED">Canceled</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={handleResetFilters}
                fullWidth
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#64748b',
                  borderColor: '#e2e8f0',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    borderColor: '#cbd5e1'
                  }
                }}
              >
                Reset Filters
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Mobile order cards */}
        <Stack spacing={2}>
          {rows.length === 0 ? (
            <Card sx={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white'
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  {searchTerm || statusFilter !== 'ALL' ? 'No orders match your filters' : 'No orders found'}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            rows.map((order) => {
              const totalAmount = order.total_amount || (order.quantity * order.price_per_unit);

              return (
                <Card key={order.id} sx={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white'
                }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                          #{order.id.toString().substring(0, 7).toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(order.created_at))}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, order.id)}>
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography sx={{ fontWeight: 700, color: '#334155' }}>{order.customer_name}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>{order.product_name}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={order.status.toUpperCase()}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: getStatusColor(order.status).bg,
                          color: getStatusColor(order.status).text,
                          border: `1px solid ${getStatusColor(order.status).border}`,
                          borderRadius: '6px'
                        }}
                      />
                      <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                        ${totalAmount?.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>

        <ActionMenu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose} orderId={selectedOrderId} onDelete={handleDeleteClick} router={router} />
        <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDeleteConfirm} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Card sx={{
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        mb: 4,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search by customer name"
              size="small"
              fullWidth
              value={localSearchTerm}
              onChange={handleSearchInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <SearchOutlined sx={{ color: '#64748b', fontSize: 20 }} />
                </InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#94a3b8',
                    borderWidth: '1px'
                  }
                }
              }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel
                id="status-filter-label"
                sx={{
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}
              >
                Status
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#94a3b8',
                    borderWidth: '1px'
                  }
                }}
              >
                <MenuItem value="ALL" sx={{ fontSize: '0.875rem' }}>All Statuses</MenuItem>
                <MenuItem value="CREATED" sx={{ fontSize: '0.875rem' }}>Created</MenuItem>
                <MenuItem value="PROCESSING" sx={{ fontSize: '0.875rem' }}>Processing</MenuItem>
                <MenuItem value="SHIPPED" sx={{ fontSize: '0.875rem' }}>Shipped</MenuItem>
                <MenuItem value="DELIVERED" sx={{ fontSize: '0.875rem' }}>Delivered</MenuItem>
                <MenuItem value="CANCELED" sx={{ fontSize: '0.875rem' }}>Canceled</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#64748b',
                borderColor: '#e2e8f0',
                px: 3,
                height: '40px',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  borderColor: '#cbd5e1',
                  color: '#475569'
                }
              }}
            >
              Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* DataGrid za Desktop */}
      <Box sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            All Orders
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            {rows.length} {rows.length === 1 ? 'order' : 'orders'} found
            {(searchTerm || statusFilter !== 'ALL') && ' (filtered)'}
          </Typography>
        </Box>

        {rows.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              {searchTerm || statusFilter !== 'ALL' ? 'No orders match your filters' : 'No orders found'}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={rows.map(order => ({
              ...order,
              total_amount: order.total_amount || (order.quantity * order.price_per_unit)
            }))}
            columns={columns}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: 'none',
              px: 2,
              '& .MuiDataGrid-columnHeaders': {
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #f1f5f9'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9'
              },
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
                '& .MuiDataGrid-cell': {
                  borderBottomColor: '#e2e8f0'
                }
              }
            }}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </Box>

      <ActionMenu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose} orderId={selectedOrderId} onDelete={handleDeleteClick} router={router} />
      <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDeleteConfirm} />
    </Box>
  );
}

function ActionMenu({ anchorEl, open, onClose, orderId, onDelete, router }: any) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      elevation={0}
      disableAutoFocusItem
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            minWidth: '180px',
            mt: 1,
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.2,
              fontSize: '0.875rem',
              fontWeight: 500,
              gap: 1.5,
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#0f172a',
              },
              '&.Mui-focusVisible': {
                backgroundColor: 'transparent',
              },
            },
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem
        disableRipple
        onClick={() => { router.push(`/orders/${orderId}`); onClose(); }}
      >
        <Launch sx={{ fontSize: 18, color: '#64748b' }} />
        <ListItemText primary="View Details" />
      </MenuItem>

      <MenuItem
        disableRipple
        onClick={() => { router.push(`/orders/${orderId}?edit=true`); onClose(); }}
      >
        <EditOutlined sx={{ fontSize: 18, color: '#64748b' }} />
        <ListItemText primary="Edit Order" />
      </MenuItem>

      <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

      <MenuItem
        disableRipple
        onClick={onDelete}
        sx={{
          color: '#ef4444',
          '&:hover': { color: '#dc2626', backgroundColor: 'transparent' }
        }}
      >
        <DeleteOutline sx={{ fontSize: 18, color: '#ef4444' }} />
        <ListItemText primary="Delete Order" />
      </MenuItem>
    </Menu>
  );
}

function DeleteDialog({ open, onClose, onConfirm }: any) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: '400px' } }}>
      <DialogTitle sx={{ fontWeight: 800, pt: 3, pb: 1 }}>Delete Order</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#64748b' }}>Are you sure? This action is permanent and cannot be undone.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" sx={{ backgroundColor: '#ef4444', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { backgroundColor: '#dc2626' } }}>Delete Order</Button>
      </DialogActions>
    </Dialog>
  );
}