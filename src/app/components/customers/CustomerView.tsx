import { Box, Typography, Button, Avatar, Stack } from '@mui/material';
import { MailOutline, HomeOutlined } from "@mui/icons-material";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

const DetailBlock = ({ icon, label, value, isHighlight = false }: any) => (
    <Box>
        <LabelWithIcon icon={icon} label={label} />
        <Typography variant="body1" sx={{ fontWeight: 700, color: isHighlight ? '#0f172a' : '#1e293b', ml: { xs: 0, sm: 4 }, mt: 0.5 }}>
            {value}
        </Typography>
    </Box>
);

export default function CustomerView({ customer, onEdit, onClose }: any) {
    return (
        <Box sx={{ p: { xs: 1, sm: 2 }, width: "100%" }}>
            <Box sx={{ display: 'grid', flexDirection: 'column', gap: 2.5 }}>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#f1f5f9', color: '#0f172a' }}>
                        {customer.full_name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={800}>{customer.full_name}</Typography>
                    </Box>
                </Stack>

                <DetailBlock
                    icon={MailOutline}
                    label="Email Address"
                    value={customer.email}
                />

                <DetailBlock
                    icon={HomeOutlined}
                    label="Delivery Address"
                    value={customer.delivery_address}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={onEdit} sx={{ bgcolor: '#0f172a', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                        Edit Profile
                    </Button>
                    <Button onClick={onClose} sx={{ color: '#64748b', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}