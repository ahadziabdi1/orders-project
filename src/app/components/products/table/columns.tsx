import { GridColDef } from '@mui/x-data-grid';
import { Typography, IconButton, Box } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export const getProductColumns = (
    onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void,
    userRole: string | null
): GridColDef[] => {
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Product Name',
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
            field: 'unit_price',
            headerName: 'Price',
            width: 110,
            align: 'right',
            sortable: false,
            filterable: false,
            hideable: false,
            valueFormatter: (value) => `$${Number(value).toFixed(2)}`
        }
    ];

    if (userRole === 'ADMIN') {
        columns.push({
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
        });
    }

    return columns;
};