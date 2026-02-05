'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button, TextField, Container, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                router.push('/orders');
            }
        };
        checkUser();
    }, [supabase, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message === 'Invalid login credentials'
                ? 'Incorrect email or password'
                : error.message);
            setLoading(false);
        } else {
            router.refresh();
            router.push('/orders');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        Orders Management App
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4 }} align="center" color="textSecondary">
                        Sign in to manage your workspace and orders.
                    </Typography>

                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            margin="normal"
                            variant="outlined"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            variant="outlined"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px',
                                backgroundColor: '#0f172a',
                                '&:hover': { backgroundColor: '#1e293b' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}