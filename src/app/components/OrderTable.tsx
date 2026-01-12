"use client";

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Chip, Typography, Card, CardContent, Stack, useMediaQuery, useTheme } from '@mui/material';

interface Order {
  id: string;
  customer_name: string;
  product_name: string;
  delivery_address: string;
  status: string;
  created_at: string;
  total_amount: number;
}

interface OrdersTableProps {
  rows: Order[];
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

const columns: GridColDef[] = [
  {
    field: 'displayId',
    headerName: 'Order ID',
    width: 120,
    resizable: false,
    renderCell: (params) => <strong>#{params.api.getAllRowIds().indexOf(params.id) + 1}</strong>
  },
  {
    field: 'product_name',
    headerName: 'Product',
    minWidth: 220,
  },
  {
    field: 'customer_name',
    headerName: 'Customer',
    minWidth: 200,
  },
  {
    field: 'delivery_address',
    headerName: 'Address',
    minWidth: 220,
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
            fontWeight: 600,
            fontSize: '0.7rem',
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
    width: 120,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '100%' }}>
        <Typography sx={{ fontWeight: 700 }}>
          ${params.value?.toFixed(2)}
        </Typography>
      </Box>
    ),
  },
];

export default function OrdersTable({ rows }: OrdersTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {rows.map((order, index) => (
          <Card key={order.id} sx={{ borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  #{index + 1}
                </Typography>
                <Chip
                  label={order.status.toUpperCase()}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    backgroundColor: getStatusColor(order.status).bg,
                    color: getStatusColor(order.status).text
                  }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{order.customer_name}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>{order.product_name}</Typography>
              <Typography variant="caption" color="textSecondary" display="block">{order.delivery_address}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'flex-end' }}>
                <Typography variant="body2">{new Date(order.created_at).toLocaleDateString()}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>${order.total_amount.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e0e0e0', mt: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, borderBottom: '1px solid #f0f0f0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>All Orders</Typography>
        <Typography variant="body2" color="textSecondary">{rows.length} orders total</Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        columnHeaderHeight={56}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            color: '#666'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f5f5f5'
          }
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }
        }}
        pageSizeOptions={[10, 20, 50]}
      />
    </Box>
  );
}