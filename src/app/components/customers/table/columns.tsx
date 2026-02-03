import { GridColDef } from '@mui/x-data-grid';
import { Typography, IconButton, Box } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export const getCustomerColumns = (onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void): GridColDef[] => [
    {
        field: 'full_name',
        headerName: 'Customer Name',
        flex: 1,
        sortable: true,
        filterable: false,
        hideable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {params.value}
                </Typography>
            </Box>
        )
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 250,
        sortable: true,
        filterable: false,
        hideable: false,
    },
    {
        field: 'delivery_address',
        headerName: 'Delivery Address',
        sortable: true,
        filterable: false,
        hideable: false,
        width: 300,
    },
    {
        field: 'actions',
        headerName: '',
        headerAlign: 'center',
        align: 'center',
        width: 50,
        sortable: false,
        resizable: false,
        filterable: false,
        hideable: false,
        renderCell: (params) => (
            <IconButton size="small" onClick={(e) => onMenuOpen(e, params.row.id)}>
                <MoreVert fontSize="small" />
            </IconButton>
        ),
    },
];