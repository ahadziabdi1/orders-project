"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/app/types/types";

export async function updateProfileAction(
  customerUuid: string,
  formData: { full_name: string; delivery_address: string }
): Promise<ActionResponse> {
  const { error } = await supabase
    .from("customers")
    .update({
      full_name: formData.full_name,
      delivery_address: formData.delivery_address,
    })
    .eq("customer_uuid", customerUuid);

  if (error) return { success: false, message: error.message };

  revalidatePath("/profile");
  return { success: true, message: "Profile updated successfully!" };
}
