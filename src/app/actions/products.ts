"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function deleteProductAction(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/products"); 
  return { success: true, message: "Product deleted successfully" };
}
