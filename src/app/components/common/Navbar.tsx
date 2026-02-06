"use client";

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dashboard, Inventory, Person, ReceiptLong, Menu as MenuIcon, Logout } from '@mui/icons-material';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const iconStyles = { fontSize: 20 };

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (data) setRole(data.role);
            }
            setLoading(false);
        };

        getUserData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                getUserData();
            } else {
                setRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    if (loading || !user) {
        return null;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const navItems = role === 'ADMIN'
        ? [
            { label: 'Dashboard', href: '/dashboard', icon: <Dashboard sx={iconStyles} /> },
            { label: 'Orders', href: '/orders', icon: <ReceiptLong sx={iconStyles} /> },
            { label: 'Products', href: '/products', icon: <Inventory sx={iconStyles} /> },
            { label: 'Customers', href: '/customers', icon: <Person sx={iconStyles} /> },
        ]
        : [
            { label: 'My Orders', href: '/orders', icon: <ReceiptLong sx={iconStyles} /> },
            { label: 'Products', href: '/products', icon: <Inventory sx={iconStyles} /> },
            { label: 'Profile', href: '/profile', icon: <Person sx={iconStyles} /> },
        ];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 64 }}>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon sx={iconStyles} />
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, flexGrow: 1, justifyContent: 'center' }}>
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Button
                                    key={item.href}
                                    component={Link}
                                    href={item.href}
                                    startIcon={item.icon}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: '8px',
                                        color: isActive ? '#60a5fa' : '#94a3b8',
                                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            color: '#fff',
                                        },
                                        '& .MuiButton-startIcon': {
                                            marginRight: '6px'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>

                    <IconButton
                        onClick={handleLogout}
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            color: '#94a3b8',
                            borderRadius: '8px',
                            p: 1.2,
                            '&:hover': {
                                color: '#f87171',
                                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                            }
                        }}
                    >
                        <Logout sx={iconStyles} />
                    </IconButton>
                </Toolbar>
            </Container>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        backgroundImage: 'none'
                    },
                }}
            >
                <Box sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2
                }}>
                    <Box component="nav">
                        <List sx={{ p: 0 }}>
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                                        <ListItemButton
                                            component={Link}
                                            href={item.href}
                                            onClick={handleDrawerToggle}
                                            sx={{
                                                borderRadius: '8px',
                                                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                                                color: isActive ? '#60a5fa' : '#fff',
                                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: isActive ? '#60a5fa' : '#94a3b8', minWidth: 40 }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '8px',
                                color: '#f87171',
                                py: 1.2,
                                '&:hover': {
                                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                                    color: '#ef4444'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <Logout sx={iconStyles} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                            />
                        </ListItemButton>
                    </Box>
                </Box>
            </Drawer>
        </AppBar>
    );
}