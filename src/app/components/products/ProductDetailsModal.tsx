"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, CircularProgress, Box, IconButton, Typography, Divider } from '@mui/material';
import { Close } from "@mui/icons-material";
import { toast } from 'react-hot-toast';

// You'll need to create these two sub-components similarly to your Order ones
// import ProductView from './ProductView';
// import ProductEditForm from './forms/ProductEditForm';

interface ProductDetailsModalProps {
    open: boolean;
    onClose: () => void;
    productId: string | null;
    initialMode: 'view' | 'edit';
    onSuccess?: () => void;
}

export default function ProductDetailsModal({ open, onClose, productId, initialMode, onSuccess }: ProductDetailsModalProps) {
    const [mode, setMode] = useState(initialMode);
    const [product, setProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (err) {
            toast.error("Failed to load product data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && productId) {
            setMode(initialMode);
            fetchProduct();
        }
    }, [open, productId, initialMode]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#64748b' }}>
                <Close />
            </IconButton>

            <DialogContent sx={{ p: 5 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
                ) : (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                            {mode === 'edit' ? "Edit Product" : "Product Details"}
                        </Typography>
                        <Divider sx={{ mb: 4 }} />

                        {mode === 'edit' ? (
                            <Box>
                                {/* Replace with your ProductEditForm */}
                                <Typography>Edit Form for {product?.name} goes here.</Typography>
                                <button onClick={() => setMode('view')}>Cancel</button>
                            </Box>
                        ) : (
                            <Box>
                                {/* Replace with your ProductView */}
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Name</Typography>
                                <Typography sx={{ mb: 2 }}>{product?.name}</Typography>

                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Price</Typography>
                                <Typography sx={{ mb: 2 }}>${product?.unit_price}</Typography>

                                <button onClick={() => setMode('edit')}>Edit Product</button>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}