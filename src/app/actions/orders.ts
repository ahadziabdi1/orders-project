"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function createOrderAction(formData: any) {
    const { error } = await supabase.from("orders").insert([
        {
            product_name: formData.product_name,
            customer_name: formData.customer_name,
            quantity: Number(formData.quantity),
            price_per_unit: Number(formData.price_per_unit),
            delivery_address: formData.delivery_address,
            status: formData.status,
        },
    ]);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath("/orders");
    return { success: true, message: "Order successfully created!" };
}

export async function deleteOrderAction(orderId: string) {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath("/orders");
    return { success: true, message: "Order deleted successfully" };
}

export async function updateOrderAction(orderId: string, formData: any) {
    const { error } = await supabase
        .from("orders")
        .update({
            product_name: formData.product_name,
            customer_name: formData.customer_name,
            quantity: Number(formData.quantity),
            price_per_unit: Number(formData.price_per_unit),
            delivery_address: formData.delivery_address,
            status: formData.status,
        })
        .eq("id", orderId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return { success: true, message: "Order successfully updated!" };
}

export async function getOrdersAction(filters?: { searchTerm?: string; status?: string }) {
    let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (filters?.searchTerm) {
        query = query.ilike("customer_name", `%${filters.searchTerm}%`);
    }

    if (filters?.status && filters.status !== "ALL") {
        query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) {
        return { success: false, message: error.message, data: [] };
    }

    return { success: true, data };
}