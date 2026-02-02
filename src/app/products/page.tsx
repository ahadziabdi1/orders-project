"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { 
    Container, Typography, Box, Button, Dialog, 
    DialogTitle, DialogContent, IconButton 
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ProductForm from '@/app/components/ProductForm'

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: products, isLoading, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            return data;
        }
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Naziv Artikla', flex: 1 },
        { 
            field: 'unit_price', 
            headerName: 'Cijena po komadu', 
            width: 200,
            valueFormatter: (value) => `${Number(value).toFixed(2)} KM`
        },
        { field: 'created_at', headerName: 'Datum dodavanja', width: 200, 
          valueGetter: (value) => new Date(value).toLocaleDateString() 
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Šifarnik Artikala</Typography>
                    <Typography color="textSecondary">Upravljajte listom proizvoda u sistemu.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setIsModalOpen(true)}
                    sx={{ backgroundColor: '#0f172a', borderRadius: 2, textTransform: 'none' }}
                >
                    Dodaj Novi Artikal
                </Button>
            </Box>

            <Box sx={{ height: 600, backgroundColor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <DataGrid
                    rows={products || []}
                    columns={columns}
                    loading={isLoading}
                    disableRowSelectionOnClick
                    sx={{ border: 'none' }}
                />
            </Box>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Novi Artikal</DialogTitle>
                    <IconButton onClick={() => setIsModalOpen(false)}><CloseIcon /></IconButton>
                </Box>
                <DialogContent>
                    <ProductForm onClose={() => { setIsModalOpen(false); refetch(); }} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}