"use client";

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import { Container, Box, Dialog, DialogTitle, DialogContent, IconButton, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import ProfileView from '@/app/components/profile/ProfileView';
import ProfileEditForm from '@/app/components/profile/forms/ProfileEditForm';

export default function ProfilePage() {
    const supabase = useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, id, email')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            const { data: customer, error: customerError } = await supabase
                .from('customers')
                .select('customer_uuid, full_name, email, delivery_address, created_at')
                .eq('email', profile.email)
                .maybeSingle();

            return {
                ...profile,
                customers: customer
            };
        }
    });

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
            <ProfileView
                profile={data}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                fullWidth
                maxWidth="sm"
                slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2, pt: 1 }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Edit Profile</DialogTitle>
                    <IconButton onClick={() => setIsEditModalOpen(false)}><CloseIcon /></IconButton>
                </Box>
                <DialogContent>
                    <ProfileEditForm
                        profile={data}
                        onCancel={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            refetch();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
}