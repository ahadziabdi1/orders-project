import { getDashboardStats } from '@/app/actions/dashboard';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Container,
    Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    if (!stats) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">Error loading dashboard data.</Typography>
            </Container>
        );
    }

    const summaryCards = [
        {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <AttachMoneyIcon fontSize="large" sx={{ color: '#2e7d32' }} />,
            bgColor: '#e8f5e9'
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: <ShoppingCartIcon fontSize="large" sx={{ color: '#0288d1' }} />,
            bgColor: '#e1f5fe'
        },
        {
            label: 'Customers',
            value: stats.customerCount,
            icon: <PeopleIcon fontSize="large" sx={{ color: '#ed6c02' }} />,
            bgColor: '#fff3e0'
        },
        {
            label: 'Products',
            value: stats.productCount,
            icon: <InventoryIcon fontSize="large" sx={{ color: '#9c27b0' }} />,
            bgColor: '#f3e5f5'
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back! Here is what's happening with your store today.
                </Typography>
            </Box>

            {/* Main Stats Grid Container */}
            <Box 
                display="grid" 
                gridTemplateColumns={{
                    xs: '1fr',           // 1 column on mobile
                    sm: 'repeat(2, 1fr)', // 2 columns on tablet
                    md: 'repeat(4, 1fr)'  // 4 columns on desktop
                }} 
                gap={3} 
                sx={{ mb: 3 }}
            >
                {/* Summary Statistics Cards */}
                {summaryCards.map((card, index) => (
                    <Card key={index} elevation={2} sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: 3,
                                backgroundColor: card.bgColor,
                                display: 'flex',
                                mr: 2
                            }}>
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                    {card.label}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {card.value}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {/* Order Status Breakdown Section */}
                {/* We use gridColumn span to make this card take up the full width */}
                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 4' } }}>
                    <Card elevation={2} sx={{ borderRadius: 4, p: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Order Status Breakdown
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            {/* Inner Grid for Statuses */}
                            <Box 
                                display="grid" 
                                gridTemplateColumns={{
                                    xs: 'repeat(2, 1fr)', 
                                    sm: 'repeat(4, 1fr)'
                                }} 
                                gap={2}
                            >
                                {Object.entries(stats.statusCounts).map(([status, count]) => (
                                    <Box 
                                        key={status} 
                                        sx={{ 
                                            textAlign: 'center', 
                                            p: 2, 
                                            border: '1px solid #eee', 
                                            borderRadius: 2 
                                        }}
                                    >
                                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                            {count as number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                            {status.toLowerCase()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}