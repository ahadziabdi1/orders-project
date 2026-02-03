import React from 'react';
import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface LabelWithIconProps {
    icon: React.ElementType<{ sx?: SxProps<Theme> }>;
    label: string;
}

const LabelWithIcon: React.FC<LabelWithIconProps> = ({ icon: Icon, label }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: '#374151' }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default LabelWithIcon;