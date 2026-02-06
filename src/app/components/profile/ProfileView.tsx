import { Box, Typography, Button, Alert } from '@mui/material';
import { PersonOutline, EmailOutlined, HomeOutlined, BadgeOutlined, CalendarTodayOutlined } from "@mui/icons-material";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

const DetailBlock = ({ icon, label, value }: any) => (
    <Box>
        <LabelWithIcon icon={icon} label={label} />
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b', ml: { xs: 0, sm: 4 }, mt: 0.5 }}>
            {value}
        </Typography>
    </Box>
);

export default function ProfileView({ profile, onEdit }: any) {
    const customer = profile?.customers;
    const hasAddress = !!customer?.delivery_address;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Profile</Typography>

            {!hasAddress && (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                    Your profile is incomplete! Please add a <strong>delivery address</strong> to speed up your future orders.
                </Alert>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <DetailBlock
                    icon={PersonOutline}
                    label="Full Name"
                    value={customer?.full_name || 'Not set'}
                />

                <DetailBlock
                    icon={CalendarTodayOutlined}
                    label="Member Since"
                    value={customer ? new Date(customer.created_at).toLocaleDateString() : 'Unknown'}
                />
                <DetailBlock
                    icon={EmailOutlined}
                    label="Email Address"
                    value={profile?.email || 'Unknown'}
                />
                <DetailBlock
                    icon={BadgeOutlined}
                    label="Role"
                    value={profile?.role || 'USER'}
                />
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <LabelWithIcon icon={HomeOutlined} label="Delivery Address" />
                <Typography variant="body1" sx={{
                    fontWeight: 600,
                    color: hasAddress ? '#334155' : '#94a3b8',
                    ml: { xs: 0, sm: 4 }, mt: 1
                }}>
                    {customer?.delivery_address || 'No address provided yet'}
                </Typography>
            </Box>

            <Box>
                <Button
                    variant="contained"
                    onClick={onEdit}
                    sx={{
                        bgcolor: '#0f172a',
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 4, py: 1,
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#1e293b' }
                    }}
                >
                    Edit Profile
                </Button>
            </Box>
        </Box>
    );
}