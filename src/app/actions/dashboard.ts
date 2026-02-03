"use server";

import { supabase } from "@/lib/supabaseClient";

export async function getDashboardStats() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("total_price, status, created_at");

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }

  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.total_price || 0),
    0
  );

  const totalOrders = orders.length;

  const statusCounts = orders.reduce((acc: Record<string, number>, order) => {
    const status = order.status || "UNKNOWN";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  return {
    totalRevenue,
    totalOrders,
    statusCounts,
    customerCount: customerCount || 0,
    productCount: productCount || 0,
  };
}
