import { Box, Typography, Button } from '@mui/material';
import { MailOutline, HomeOutlined, CalendarTodayOutlined } from "@mui/icons-material";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

const DetailBlock = ({ icon, label, value, isHighlight = false }: any) => (
    <Box>
        <LabelWithIcon icon={icon} label={label} />
        <Typography variant="body1" sx={{ fontWeight: 700, color: isHighlight ? '#0f172a' : '#1e293b', ml: { xs: 0, sm: 4 }, mt: 0.5, wordBreak: "break-word" }}>
            {value}
        </Typography>
    </Box>
);

export default function CustomerView({ customer, onEdit, onClose }: any) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <DetailBlock
                    icon={MailOutline}
                    label="Email Address"
                    value={customer.email}
                />
                <DetailBlock
                    icon={CalendarTodayOutlined}
                    label="Member Since"
                    value={new Date(customer.created_at).toLocaleDateString()}
                />
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155', ml: { xs: 0, sm: 4 }, mt: 1 }}>
                    {customer.delivery_address || 'No address provided'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={onEdit}
                    sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' }, borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}
                >
                    Edit Customer
                </Button>
                <Button
                    onClick={onClose}
                    sx={{ color: '#64748b', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}
                >
                    Close
                </Button>
            </Box>
        </Box>
    );
}