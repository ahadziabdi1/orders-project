"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, IconButton, CircularProgress, Box, Typography } from '@mui/material';
import { Close } from "@mui/icons-material";
import { toast } from 'react-hot-toast';

import ProductView from '@/app/components/products/ProductView';
import ProductEditForm from '@/app/components/products/forms/ProductEditForm';

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

    const fetchProduct = useCallback(async () => {
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
    }, [productId]);

    useEffect(() => {
        if (open && productId) {
            setMode(initialMode);
            fetchProduct();
        }
    }, [open, productId, initialMode, fetchProduct]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '16px' } } }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#64748b', zIndex: 1 }}>
                <Close />
            </IconButton>

            <DialogContent sx={{ p: 5 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : product ? (
                    mode === 'edit' ? (
                        <ProductEditForm
                            product={product}
                            onCancel={() => setMode('view')}
                            onSuccess={() => {
                                fetchProduct();
                                setMode('view');
                                if (onSuccess) onSuccess();
                            }}
                        />
                    ) : (
                        <ProductView
                            product={product}
                            onEdit={() => setMode('edit')}
                            onClose={onClose}
                        />
                    )
                ) : (
                    <Typography>No product data found.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
}