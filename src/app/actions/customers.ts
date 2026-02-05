"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/app/types/types";

export async function createCustomerAction(
  formData: any
): Promise<ActionResponse> {
  const { error } = await supabase.from("customers").insert([formData]);

  if (error) return { success: false, message: error.message };

  revalidatePath("/customers");
  return { success: true, message: "Customer successfully created!" };
}

export async function updateCustomerAction(
  id: string,
  formData: any
): Promise<ActionResponse> {
  const { error } = await supabase
    .from("customers")
    .update(formData)
    .eq("customer_uuid", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/customers");
  return { success: true, message: "Customer updated successfully!" };
}

export async function deleteCustomerAction(
  id: string
): Promise<ActionResponse> {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("customer_uuid", id);
    
  if (error) return { success: false, message: error.message };

  revalidatePath("/customers");
  return { success: true, message: "Customer deleted successfully" };
}
