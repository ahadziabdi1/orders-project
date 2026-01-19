import { Card, CardContent, Box, Typography, IconButton, Chip } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { Order, getStatusColor } from '@/app/types/orders';

interface OrderMobileCardProps {
    order: Order;
    onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

export const OrderMobileCard = ({ order, onMenuOpen }: OrderMobileCardProps) => {
    const style = getStatusColor(order.status);
    const total = order.total_amount || (order.quantity * order.price_per_unit);

    return (
        <Card sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 800 }}>#{order.id.substring(0, 7).toUpperCase()}</Typography>
                    <IconButton size="small" onClick={(e) => onMenuOpen(e, order.id)}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Box>
                <Typography sx={{ fontWeight: 700 }}>{order.customer_name}</Typography>
                <Typography variant="body2" color="textSecondary">{order.product_name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Chip label={order.status} size="small" sx={{ bgcolor: style.bg, color: style.text }} />
                    <Typography sx={{ fontWeight: 800 }}>${total.toFixed(2)}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};