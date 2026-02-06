"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, IconButton, CircularProgress, Box, Typography, Divider } from '@mui/material';
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
                .eq('customer_uuid', customerId)
                .single();
            if (error) throw error;
            setCustomer(data);
        } catch (err) {
            toast.error("Failed to load customer data.");
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="body" slotProps={{ paper: { sx: { borderRadius: '16px' } } }}>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#64748b', zIndex: 10 }}>
                <Close />
            </IconButton>

            <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
                ) : customer ? (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, pr: 4 }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                    {mode === 'edit' ? "Edit Customer" : customer.full_name}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {mode === 'edit' ? (
                            <CustomerEditForm
                                customer={customer}
                                onCancel={() => setMode('view')}
                                onSuccess={() => { fetchCustomer(); setMode('view'); onRefresh(); }}
                            />
                        ) : (
                            <CustomerView customer={customer} onEdit={() => setMode('edit')} onClose={onClose} />
                        )}
                    </Box>
                ) : <Typography>No customer found.</Typography>}
            </DialogContent>
        </Dialog>
    );
}