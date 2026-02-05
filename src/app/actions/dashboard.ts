"use server";

import { supabase } from "@/lib/supabaseClient";

export async function getDashboardStats() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateLimit = thirtyDaysAgo.toISOString();

    const [ordersRes, recentOrdersRes, customersRes, productsRes] =
      await Promise.all([
        supabase
          .from("orders")
          .select(
            `
            total_price, 
            status, 
            created_at, 
            products ( name )
          `
          )
          .gte("created_at", dateLimit),

        supabase
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
          .limit(5),

        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
      ]);

    if (ordersRes.error || recentOrdersRes.error) {
      console.error(
        "Supabase Error:",
        ordersRes.error || recentOrdersRes.error
      );
      return null;
    }

    const orders = ordersRes.data || [];

    const dailyRevenue: Record<string, number> = {};
    const last30DaysLabels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    last30DaysLabels.forEach((date) => (dailyRevenue[date] = 0));

    const salesMap: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    let totalRevenue = 0;

    orders.forEach((order) => {
      const price = Number(order.total_price || 0);
      totalRevenue += price;

      const date = new Date(order.created_at).toISOString().split("T")[0];
      if (dailyRevenue.hasOwnProperty(date)) {
        dailyRevenue[date] += price;
      }

      const s = order.status || "UNKNOWN";
      statusCounts[s] = (statusCounts[s] || 0) + 1;

      const productName = (order.products as any)?.name || "Unknown Product";
      salesMap[productName] = (salesMap[productName] || 0) + price;
    });

    const topProducts = Object.entries(salesMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const revenueTrends = Object.entries(dailyRevenue).map(
      ([date, amount]) => ({
        date,
        amount,
      })
    );

    return {
      totalRevenue,
      totalOrders: orders.length,
      statusCounts,
      customerCount: customersRes.count || 0,
      productCount: productsRes.count || 0,
      recentOrders: recentOrdersRes.data || [],
      topProducts,
      revenueTrends,
    };
  } catch (err) {
    console.error("Unexpected Dashboard Error:", err);
    return null;
  }
}
