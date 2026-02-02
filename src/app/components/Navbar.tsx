"use client";

import { useState } from 'react';
import { AppBar, Toolbar, Button, Container, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inventory, People, ReceiptLong, Menu as MenuIcon } from '@mui/icons-material';

const navItems = [
    { label: 'Orders', href: '/orders', icon: <ReceiptLong /> },
    { label: 'Products', href: '/products', icon: <Inventory /> },
    { label: 'Customers', href: '/customers', icon: <People /> },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'center', height: 64 }}>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, position: 'absolute', left: 16 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
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
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease-in-out',

                                        color: isActive ? '#60a5fa' : '#ffffff',

                                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',

                                        '& .MuiButton-startIcon': {
                                            color: isActive ? '#60a5fa' : '#ffffff',
                                        },

                                        '&:hover': {
                                            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                            color: '#60a5fa',
                                            '& .MuiButton-startIcon': {
                                                color: '#60a5fa',
                                            }
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>
                </Toolbar>
            </Container>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, backgroundColor: '#0f172a', color: '#fff' },
                }}
            >
                <List sx={{ p: 2 }}>
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
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
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
        </AppBar>
    );
}