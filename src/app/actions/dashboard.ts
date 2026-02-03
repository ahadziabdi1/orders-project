"use server";

import { supabase } from "@/lib/supabaseClient";

export async function getDashboardStats() {
  // 1. Fetch Stats
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("total_price, status, created_at");

  // 2. Fetch Recent Orders (Last 5)
  const { data: recentOrders, error: recentError } = await supabase
    .from("orders")
    .select(
      `
      id, 
      total_price, 
      status, 
      created_at,
      customers ( full_name )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (ordersError || recentError) {
    console.error("Error:", ordersError || recentError);
    return null;
  }

  // Logic for totals
  const totalRevenue = orders.reduce(
    (acc, o) => acc + Number(o.total_price || 0),
    0
  );
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    const s = o.status || "UNKNOWN";
    acc[s] = (acc[s] || 0) + 1;
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
    totalOrders: orders.length,
    statusCounts,
    customerCount: customerCount || 0,
    productCount: productCount || 0,
    recentOrders: recentOrders || [], // Return the real data here
  };
}
