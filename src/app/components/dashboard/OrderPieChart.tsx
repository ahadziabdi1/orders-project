'use client';

import { Box } from '@mui/material';
import { NoSSRPieChart } from '@/app/components/dashboard/DashboardCharts';

interface PieDataPoint {
    label: string;
    value: number;
    color: string;
}

export default function OrderPieChart({ data }: { data: PieDataPoint[] }) {
    return (
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <NoSSRPieChart
                series={[
                    {
                        data: data,
                        valueFormatter: (item: { value: number }) => `${item.value}`,
                        innerRadius: 0,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        cx: 100,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { additionalRadius: -10 },
                    },
                ]}
                slotProps={{
                    tooltip: {
                        sx: {
                            '& .MuiChartsTooltip-paper': {
                                padding: '4px 8px',
                            },
                            '& .MuiChartsTooltip-cell': {
                                fontSize: '12px !important',
                                padding: '0 4px',
                            },
                            '& .MuiChartsTooltip-label': {
                                color: '#555',
                                fontWeight: 500,
                            },
                            '& .MuiChartsTooltip-value': {
                                fontWeight: 600,
                                color: '#333',
                                textAlign: 'right',
                            },
                            '& .MuiChartsTooltip-mark': {
                                width: '9px',
                                height: '9px',
                            },
                        }
                    }
                }}
                width={220}
                height={220}
            />
        </Box>
    );
}