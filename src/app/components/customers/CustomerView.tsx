import { Box, Typography, Button, Avatar, Stack } from '@mui/material';
import { MailOutline, PhoneOutlined, PersonOutline } from "@mui/icons-material";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

const DetailBlock = ({ icon, label, value }: any) => (
    <Box>
        <LabelWithIcon icon={icon} label={label} />
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b', ml: 4, mt: 0.5 }}>
            {value || 'N/A'}
        </Typography>
    </Box>
);

export default function CustomerView({ customer, onEdit, onClose }: any) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#f1f5f9', color: '#0f172a' }}>
                    {customer.name?.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight={800}>{customer.name}</Typography>
                    <Typography variant="body2" color="textSecondary">Customer ID: {customer.id.split('-')[0]}</Typography>
                </Box>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <DetailBlock icon={MailOutline} label="Email Address" value={customer.email} />
                <DetailBlock icon={PhoneOutlined} label="Phone Number" value={customer.phone} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={onEdit} sx={{ bgcolor: '#0f172a', borderRadius: '8px', textTransform: 'none', px: 4 }}>
                    Edit Profile
                </Button>
                <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none' }}>
                    Close
                </Button>
            </Box>
        </Box>
    );
}