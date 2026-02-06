"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/app/types/types";

export async function updateProfileAction(
  profileId: string,
  formData: { full_name: string; email: string; delivery_address: string }
): Promise<ActionResponse> {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      email: formData.email,
    })
    .eq("id", profileId);

  if (profileError) {
    return {
      success: false,
      message: `Profile update failed: ${profileError.message}`,
    };
  }

  const { error: customerError } = await supabase
    .from("customers")
    .update({
      full_name: formData.full_name,
      email: formData.email,
      delivery_address: formData.delivery_address,
    })
    .eq("customer_uuid", profileId);

  if (customerError) {
    return {
      success: false,
      message: `Customer update failed: ${customerError.message}`,
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Profile and Customer data updated successfully!",
  };
}
