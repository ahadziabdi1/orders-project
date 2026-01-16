import { GridColDef } from '@mui/x-data-grid';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { getStatusColor } from './types';

export const getColumns = (handleMenuOpen: (e: any, id: string) => void): GridColDef[] => [
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