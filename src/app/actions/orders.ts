"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { OrderFormData, ActionResponse } from "@/app/types/types";

export async function createOrderAction(
    formData: OrderFormData
): Promise<ActionResponse> {
    const { error } = await supabase.from("orders").insert([formData]);

    if (error) return { success: false, message: error.message };

    revalidatePath("/orders");
    return { success: true, message: "Order successfully created!" };
}

export async function deleteOrderAction(
    orderId: string
): Promise<ActionResponse> {
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