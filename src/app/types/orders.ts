import React from 'react';

export type OrderStatus = 'CREATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface OrderFormData {
    product_name: string;
    customer_name: string;
    quantity: number;
    price_per_unit: number;
    delivery_address: string | null;
    status: OrderStatus;
}

export interface Order extends OrderFormData {
    id: string;
    created_at: string;
    total_amount: number;
}

export interface ActionResponse<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

export interface DetailBlockProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    isHighlight?: boolean;
}

export const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'CREATED':
            return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' };
        case 'PROCESSING':
            return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: 'rgba(245, 158, 11, 0.2)' };
        case 'SHIPPED':
            return { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed', border: 'rgba(139, 92, 246, 0.2)' };
        case 'DELIVERED':
            return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.2)' };
        case 'CANCELED':
            return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' };
        default:
            return { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' };
    }
};