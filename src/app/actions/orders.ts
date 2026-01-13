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