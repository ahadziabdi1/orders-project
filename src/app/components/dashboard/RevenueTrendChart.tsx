"use client";
import React, { useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, ToggleButton, ToggleButtonGroup, Typography, Stack } from '@mui/material';

export default function RevenueTrendChart({ data }: { data: { date: string, amount: number }[] }) {
    const [days, setDays] = useState(30);

    const filteredData = data.slice(-days);

    const handleChange = (event: React.MouseEvent<HTMLElement>, newDays: number) => {
        if (newDays !== null) setDays(newDays);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Showing performance for the last {days} days
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={days}
                    exclusive
                    onChange={handleChange}
                    size="small"
                    sx={{ bgcolor: '#f5f5f5', border: 'none', p: 0.5, borderRadius: 2 }}
                >
                    <ToggleButton value={7} sx={{ border: 'none', borderRadius: '6px !important', px: 2, fontWeight: 600 }}>7D</ToggleButton>
                    <ToggleButton value={30} sx={{ border: 'none', borderRadius: '6px !important', px: 2, fontWeight: 600 }}>30D</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            <Box sx={{ height: 350, width: '100%' }}>
                <LineChart
                    dataset={filteredData}
                    xAxis={[{
                        dataKey: 'date',
                        scaleType: 'point',
                        valueFormatter: (value) => {
                            const date = new Date(value);
                            return days === 7
                                ? date.toLocaleDateString(undefined, { weekday: 'short' })
                                : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        },
                        tickLabelStyle: { fontSize: 12, fill: '#888' },
                        disableLine: true,
                        disableTicks: true,
                    }]}
                    yAxis={[{
                        disableLine: true,
                        disableTicks: true,
                        tickLabelStyle: { fontSize: 12, fill: '#888' },
                        valueFormatter: (val: number | null) => {
                            if (val === null) return '';
                            return `$${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`;
                        },
                    }]}
                    series={[{
                        dataKey: 'amount',
                        area: true,
                        color: '#10b981',
                        showMark: false,
                        curve: "catmullRom",
                        connectNulls: true,
                        valueFormatter: (val: number | null) => `$${val?.toLocaleString() ?? '0'}`,
                    }]}
                    sx={{
                        '.MuiAreaElement-root': {
                            fill: 'url(#revenueGradient)',
                            fillOpacity: 0.3,
                        },
                        '.MuiLineElement-root': {
                            strokeWidth: 4,
                        },
                    }}
                    margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
                >
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </LineChart>
            </Box>
        </Box>
    );
}