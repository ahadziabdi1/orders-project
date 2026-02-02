import React from 'react';
import { GridColDef, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { Chip, IconButton, Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Order, getStatusColor, OrderStatus } from '@/app/types/orders';

const STATUS_OPTIONS: OrderStatus[] = ['CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'];

const StatusEditCell = (params: GridRenderEditCellParams) => {
    const { id, value, field } = params;
    const apiRef = useGridApiContext();

    const handleChange = async (event: SelectChangeEvent) => {
        await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
        apiRef.current.stopCellEditMode({ id, field });
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            size="small"
            fullWidth
            autoFocus
            open={true}
            sx={{
                height: '100%',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': {
                    py: 0,
                    fontWeight: 700,
                    fontSize: '0.75rem'
                }
            }}
        >
            {STATUS_OPTIONS.map((option) => (
                <MenuItem
                    key={option}
                    value={option}
                    sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                >
                    {option}
                </MenuItem>
            ))}
        </Select>
    );
};

export const getColumns = (
    handleMenuOpen: (e: React.MouseEvent<HTMLElement>, id: string) => void
): GridColDef<Order>[] => [
        {
            field: 'id',
            headerName: 'Order ID',
            width: 120,
            resizable: false,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                        #{params.value.substring(0, 7).toUpperCase()}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'product_name',
            headerName: 'Product',
            minWidth: 220,
            sortable: true,
            filterable: false,
            hideable: false,
        },
        {
            field: 'customer_name',
            headerName: 'Customer',
            minWidth: 180,
            sortable: true,
            filterable: false,
            hideable: false,
        },
        {
            field: 'delivery_address',
            headerName: 'Address',
            minWidth: 180,
            filterable: false,
            hideable: false,
            valueFormatter: (value) => value ?? '-',
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: STATUS_OPTIONS,
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
                            cursor: 'pointer'
                        }}
                    />
                );
            },
            renderEditCell: (params) => <StatusEditCell {...params} />,
        },
        {
            field: 'created_at',
            headerName: 'Date',
            width: 130,
            resizable: false,
            filterable: false,
            hideable: false,
            valueGetter: (value: string) => value ? new Date(value) : null,
            valueFormatter: (value: Date | null) => {
                if (!value) return '';
                return new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }).format(value);
            },
        },
        {
            field: 'total_price',
            headerName: 'Amount',
            width: 110,
            align: 'right',
            sortable: false,
            filterable: false,
            hideable: false,
            valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '100%' }}>
                    <Typography sx={{ fontWeight: 700 }}>
                        ${Number(params.value).toFixed(2)}
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
            filterable: false,
            hideable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, params.row.id)}
                >
                    <MoreVert fontSize="small" />
                </IconButton>
            ),
        },
    ];