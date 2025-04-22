interface User{
    id: number;
    name: string;
    email: string;
    token: string|null;
}

interface OrderItem{
    id: number;
    order_id: number;
    item_name: string;
    extra_description: string;
    quantity: number;
    price: number;
}

interface Restaurant{
    name: string;
    address?: string;
    phone: string;
    whatsapp?: string;
    logo_url?: string;
    description?: string;
    delivery_time?: string;
}

interface Client{
    name: string;
    phone: string;
    whatsapp?: string;
    address?: string;
    estimated_delivery_time?: string;
}

interface Order{
    id: number;
    status: string;
    restaurant_data: Restaurant[];
    client_data: Client[];
    total: number;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

export interface OrderData{
    order: Order;
    restaurant: Restaurant;
    order_items: OrderItem[];
}

export default Order;