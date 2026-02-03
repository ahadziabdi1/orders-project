'use client';

import dynamic from 'next/dynamic';

const PieChart = dynamic(
    () => import('@mui/x-charts/PieChart').then((mod) => mod.PieChart),
    { ssr: false }
);

export const NoSSRPieChart = (props: any) => {
    return <PieChart {...props} />;
};