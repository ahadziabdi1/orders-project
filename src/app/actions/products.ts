"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { ProductFormData, ActionResponse } from "@/app/types/types";

export async function createProductAction(
  formData: ProductFormData
): Promise<ActionResponse> {
  const { error } = await supabase.from("products").insert([formData]);

  if (error) return { success: false, message: error.message };

  revalidatePath("/products");
  return { success: true, message: "Product successfully created!" };
}

export async function updateProductAction(
  id: string,
  formData: ProductFormData
): Promise<ActionResponse> {
  const { error } = await supabase
    .from("products")
    .update(formData)
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/products");
  return { success: true, message: "Product updated successfully!" };
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/products");
  return { success: true, message: "Product deleted successfully" };
}
