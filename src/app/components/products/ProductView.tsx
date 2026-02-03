import { Box, Typography, Button } from '@mui/material';
import { Inventory2Outlined, PaidOutlined } from "@mui/icons-material";
import LabelWithIcon from "@/app/components/common/LabelWithIcon";

const DetailBlock = ({ icon, label, value, isHighlight = false }: any) => (
    <Box>
        <LabelWithIcon icon={icon} label={label} />
        <Typography variant="body1" sx={{ fontWeight: 700, color: isHighlight ? '#0f172a' : '#1e293b', ml: { xs: 0, sm: 4 }, mt: 0.5 }}>
            {value}
        </Typography>
    </Box>
);

export default function ProductView({ product, onEdit, onClose }: { product: any, onEdit: () => void, onClose: () => void }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <DetailBlock
                    icon={Inventory2Outlined}
                    label="Product Name"
                    value={product?.name ?? 'Unnamed Product'}
                />
                <DetailBlock
                    icon={PaidOutlined}
                    label="Unit Price"
                    value={`$${product?.unit_price?.toFixed(2) ?? '0.00'}`}
                    isHighlight
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={onEdit} sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' }, borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                    Edit Product
                </Button>
                <Button onClick={onClose} sx={{ color: '#64748b', borderRadius: '8px', textTransform: 'none', px: 4, fontWeight: 600 }}>
                    Close
                </Button>
            </Box>
        </Box>
    );
}