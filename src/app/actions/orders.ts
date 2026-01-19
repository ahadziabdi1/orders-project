"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { OrderFormData, Order, ActionResponse } from "@/app/types/orders";

export async function createOrderAction(formData: OrderFormData): Promise<ActionResponse> {
    const { error } = await supabase.from("orders").insert([formData]);

    if (error) return { success: false, message: error.message };

    revalidatePath("/orders");
    return { success: true, message: "Order successfully created!" };
}

export async function deleteOrderAction(orderId: string): Promise<ActionResponse> {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) return { success: false, message: error.message };

    revalidatePath("/orders");
    return { success: true, message: "Order deleted successfully" };
}

export async function updateOrderAction(
    orderId: string,
    formData: OrderFormData
): Promise<ActionResponse> {
    const { error } = await supabase
        .from("orders")
        .update(formData)
        .eq("id", orderId);

    if (error) return { success: false, message: error.message };

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    return { success: true, message: "Order successfully updated!" };
}

export async function getOrdersAction(
    filters?: { searchTerm?: string; status?: string }
): Promise<ActionResponse<Order[]>> {
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

    return { success: true, message: "Fetched", data: (data as Order[]) || [] };
}