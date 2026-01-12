import { supabase } from '@/lib/supabaseClient';
import { Container, Typography, Box } from '@mui/material';
import OrdersTable from '@/app/components/OrderTable';

export default async function OrdersPage() {
    // Fetch including product_name
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, customer_name, product_name, status, created_at, quantity, price_per_unit')
        .order('created_at', { ascending: false });

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    // Calculate total_amount for the 'Amount' column
    const formattedOrders = orders?.map(order => ({
        ...order,
        total_amount: order.quantity * order.price_per_unit
    })) || [];

    return (
        <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 6 }, backgroundColor: '#fdfdfd' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Orders Management
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage and track all customer orders from your dashboard.
                    </Typography>
                </Box>

                <OrdersTable rows={formattedOrders} />
            </Container>
        </Box>
    );
}