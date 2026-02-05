"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { OrderFormData, ActionResponse } from "@/app/types/types";

export async function createOrderAction(
  formData: OrderFormData
): Promise<ActionResponse> {
  const { error: orderError } = await supabase
    .from("orders")
    .insert([formData]);

  if (orderError) return { success: false, message: orderError.message };

  try {
    const { data: customer, error: fetchError } = await supabase
      .from("customers")
      .select("delivery_address")
      .eq("customer_uuid", formData.customer_uuid)
      .single();

    if (
      !fetchError &&
      !customer?.delivery_address &&
      formData.delivery_address
    ) {
      await supabase
        .from("customers")
        .update({ delivery_address: formData.delivery_address })
        .eq("customer_uuid", formData.customer_uuid);
    }
  } catch (e) {
    console.error("Error updating user address:", e);
  }

  revalidatePath("/orders");
  return {
    success: true,
    message: "Order successfully created!",
  };
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
