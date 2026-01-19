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