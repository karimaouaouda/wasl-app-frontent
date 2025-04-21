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
}

interface Order{
    id: number;
    status: string;
    restaurant_data: Restaurant[];
    total: number;
    created_at: string;
    updated_at: string;
    order_items: OrderItem[];
}

export default Order;