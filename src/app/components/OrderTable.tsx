"use client";

import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Order {
  id: string;
  product_name: string;
  customer_name: string;
  quantity: number;
  price_per_unit: number;
  status: string;
  created_at: string;
}

interface OrdersTableProps {
  rows: Order[];
}

const columns: GridColDef[] = [
  { field: 'product_name', headerName: 'Product', width: 200 },
  { field: 'customer_name', headerName: 'Customer', width: 150 },
  { field: 'quantity', headerName: 'Qty', type: 'number', width: 100 },
  { field: 'price_per_unit', headerName: 'Price ($)', type: 'number', width: 120 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'created_at', headerName: 'Date', width: 200 },
];

export default function OrdersTable({ rows }: OrdersTableProps) {
  return (
    <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row.id} // Koristi UUID iz baze [cite: 43]
      />
    </div>
  );
}