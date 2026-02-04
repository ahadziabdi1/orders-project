'use client';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Paper } from '@mui/material';

export default function TopProductsChart({ data }: { data: { label: string, value: number }[] }) {
    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                No sales data available
            </Box>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
            <BarChart
                dataset={data}
                yAxis={[{
                    scaleType: 'band',
                    dataKey: 'label',
                    tickLabelStyle: {
                        fill: '#666',
                        fontSize: 12,
                        fontWeight: 500,
                        angle: -45,
                        textAnchor: 'end',
                        dominantBaseline: 'central',
                    },
                }]}
                xAxis={[{
                    valueFormatter: (value: number | null) => `$${(value ?? 0) / 1000}k`,
                }]}
                series={[{
                    dataKey: 'value',
                    valueFormatter: (value: number | null) => `$${value?.toLocaleString()}`,
                    color: '#8b5cf6',
                }]}
                layout="horizontal"
                height={400}
                margin={{ left: 20, right: 20, top: 20, bottom: 100 }}
                grid={{ vertical: true }}
                hideLegend={true}
                slotProps={{
                    bar: {
                        rx: 5,
                        ry: 5,
                    }
                }}
            />
        </Paper>
    );
}