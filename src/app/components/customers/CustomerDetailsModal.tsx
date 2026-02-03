"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, IconButton, CircularProgress, Box, Typography } from '@mui/material';
import { Close } from "@mui/icons-material";
import { toast } from 'react-hot-toast';
import CustomerView from '@/app/components/customers/CustomerView';
import CustomerEditForm from '@/app/components/customers/forms/CustomerEditForm';

export default function CustomerDetailsModal({ open, onClose, customerId, initialMode, onRefresh }: any) {
    const [mode, setMode] = useState(initialMode);
    const [customer, setCustomer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCustomer = useCallback(async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('id', customerId)
                .single();
            if (error) throw error;
            setCustomer(data);
        } catch (err) {
            toast.error("Failed to load customer data");
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        if (open && customerId) {
            setMode(initialMode);
            fetchCustomer();
        }
    }, [open, customerId, initialMode, fetchCustomer]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#64748b' }}>
                <Close />
            </IconButton>
            <DialogContent sx={{ p: 5 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
                ) : customer ? (
                    mode === 'edit' ? (
                        <CustomerEditForm
                            customer={customer}
                            onCancel={() => setMode('view')}
                            onSuccess={() => { fetchCustomer(); setMode('view'); onRefresh(); }}
                        />
                    ) : (
                        <CustomerView customer={customer} onEdit={() => setMode('edit')} onClose={onClose} />
                    )
                ) : <Typography>No customer found.</Typography>}
            </DialogContent>
        </Dialog>
    );
}