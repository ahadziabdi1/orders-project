"use client";

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Chip, Typography, Card, CardContent, Stack, useMediaQuery, useTheme } from '@mui/material';

interface Order {
  id: string;
  customer_name: string;
  product_name: string;
  status: string;
  created_at: string;
  total_amount: number;
}

interface OrdersTableProps {
  rows: Order[];
}

// Function to determine color based on status
const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
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
    width: 300,
    resizable: true
  },
  {
    field: 'customer_name',
    headerName: 'Customer',
    width: 250,
    resizable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
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
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            '& .MuiChip-label': { px: 1.5 },
          }}
        />
      );
    }
  },
  {
    field: 'created_at',
    headerName: 'Date',
    width: 150,
    valueGetter: (value) => value ? new Date(value) : null,
    valueFormatter: (value) => {
      if (!value) return '';
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(value);
    },
    resizable: false,
  },
  {
    field: 'total_amount',
    headerName: 'Amount',
    width: 180,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 600 }}>
        ${params.value?.toFixed(2)}
      </Typography>
    ),
    resizable: true,
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
              <Typography variant="body2" color="textSecondary">{order.product_name}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
    <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e0e0e0', mt: 3 }}>
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
          }
        }}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Box>
  );
}