"use client";

import { useState, useMemo } from 'react';
import { DataGrid, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import { Box, Typography, useMediaQuery, useTheme, Stack } from '@mui/material';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

// Import your custom columns and components (similar to your orders setup)
import { getProductColumns } from './products-table/columns';

interface ProductsTableProps {
    rows: any[];
    loading: boolean;
    rowCount: number;
    paginationModel: { page: number; pageSize: number };
    onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
    sortModel: GridSortModel;
    onSortChange: (model: GridSortModel) => void;
    onRefresh: () => void;
}

export default function ProductsTable(props: ProductsTableProps) {
    const { rows, loading, rowCount, paginationModel, onPaginationModelChange, sortModel, onSortChange, onRefresh } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const apiRef = useGridApiRef();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const columns = useMemo(() => getProductColumns(handleMenuOpen), []);

    return (
        <Box sx={{ mt: 3 }}>
            {isMobile ? (
                <Stack spacing={2}>
                    {rows.length === 0 ? (
                        <Typography align="center" sx={{ py: 4, color: 'text.secondary' }}>No products found</Typography>
                    ) : (
                        rows.map((product) => (
                            <Box key={product.id} sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Typography fontWeight={700}>{product.name}</Typography>
                                <Typography variant="body2">${product.unit_price}</Typography>
                            </Box>
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
                    <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Product Catalog</Typography>
                        <Typography variant="body2" color="textSecondary">{rowCount} products total</Typography>
                    </Box>
                    <DataGrid
                        apiRef={apiRef}
                        rows={rows}
                        columns={columns}
                        sortingMode="server"
                        sortModel={sortModel}
                        onSortModelChange={onSortChange}
                        paginationMode="server"
                        rowCount={rowCount}
                        loading={loading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={onPaginationModelChange}
                        pageSizeOptions={[10, 20, 50]}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            px: 2,
                            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, color: '#475569' },
                            '& .MuiDataGrid-cell:focus': { outline: 'none' },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}