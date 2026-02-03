import { getDashboardStats } from '@/app/actions/dashboard';
import {
    Card, CardContent, Typography, Box, Container, Divider,
    Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Helper for status colors
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'error';
        default: return 'default';
    }
};

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    if (!stats) return <Container sx={{ mt: 4 }}><Typography color="error">Error loading data.</Typography></Container>;

    const summaryCards = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, bgColor: '#e8f5e9', iconColor: '#2e7d32' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCartIcon />, bgColor: '#e1f5fe', iconColor: '#0288d1' },
        { label: 'Customers', value: stats.customerCount, icon: <PeopleIcon />, bgColor: '#fff3e0', iconColor: '#ed6c02' },
        { label: 'Products', value: stats.productCount, icon: <InventoryIcon />, bgColor: '#f3e5f5', iconColor: '#9c27b0' },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back! Here is what's happening with your store today.
                </Typography>
            </Box>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3} sx={{ mb: 3 }}>
                {summaryCards.map((card, i) => (
                    <Card key={i} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: card.bgColor, color: card.iconColor, mr: 2, borderRadius: 2 }}>
                                {card.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{card.label}</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{card.value}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Bottom Section */}
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>

                {/* Status Breakdown */}
                <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Order Inventory</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            {Object.entries(stats.statusCounts).map(([status, count]) => (
                                <Box key={status} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2, textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{count as number}</Typography>
                                    <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary' }}>{status}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                {/* Recent Orders List */}
                <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Orders</Typography>
                            <Button size="small" endIcon={<ArrowForwardIcon />}>View All</Button>
                        </Box>
                        <Divider />
                        <List disablePadding>
                            {stats.recentOrders.map((order: any) => (
                                <ListItem key={order.id} sx={{ px: 0, py: 1.5 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#f5f5f5', color: '#666' }}>
                                            <ShoppingCartIcon fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={order.customers?.full_name || `Order #${order.id.slice(0, 5)}`}
                                        secondary={new Date(order.created_at).toLocaleDateString()}
                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    />
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            ${order.total_price}
                                        </Typography>
                                        <Chip
                                            label={order.status}
                                            size="small"
                                            color={getStatusColor(order.status) as any}
                                            sx={{ fontSize: '0.65rem', height: 20 }}
                                        />
                                    </Box>
                                </ListItem>
                            ))}
                            {stats.recentOrders.length === 0 && (
                                <Typography variant="body2" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
                                    No recent orders found.
                                </Typography>
                            )}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}