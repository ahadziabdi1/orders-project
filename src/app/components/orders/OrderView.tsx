import { Box, Typography, Button } from '@mui/material';
import { PersonOutline, ShoppingBagOutlined, NumbersOutlined, PaidOutlined, HomeOutlined } from "@mui/icons-material";
import { Order, DetailBlockProps } from '@/app/types/orders';

const LabelWithIcon = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>{label}</Typography>
    </Box>
);

const DetailBlock = ({ icon, label, value, isHighlight = false }: DetailBlockProps) => (
    <Box>
        <LabelWithIcon icon={icon} label={label} />
        <Typography variant="body1" sx={{ fontWeight: 700, color: isHighlight ? '#0f172a' : '#1e293b', ml: { xs: 0, sm: 4 }, mt: 0.5 }}>
            {value}
        </Typography>
    </Box>
);

export default function OrderView({ order, onEdit, onClose }: { order: Order, onEdit: () => void, onClose: () => void }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <DetailBlock
                    icon={PersonOutline}
                    label="Customer Name"
                    value={order?.customer_name ?? 'Unknown'}
                />
                <DetailBlock
                    icon={ShoppingBagOutlined}
                    label="Product"
                    value={order?.product_name ?? 'Unknown'}
                />
                <DetailBlock
                    icon={NumbersOutlined}
                    label="Quantity"
                    value={order?.quantity ?? 0}
                />
                <DetailBlock
                    icon={PaidOutlined}
                    label="Total Amount"
                    value={`$${order?.total_price?.toFixed(2) ?? '0.00'}`}
                    isHighlight
                />
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155', ml: { xs: 0, sm: 4 }, mt: 1 }}>
                    {order.delivery_address || 'No address provided'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={onEdit} sx={{ bgcolor: '#0f172a', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                    Edit Order
                </Button>
                <Button onClick={onClose} sx={{ color: '#64748b', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                    Close
                </Button>
            </Box>
        </Box>
    );
}