"use server";

import { supabase } from "@/lib/supabaseClient";

export async function getDashboardStats() {
  try {
    const [ordersRes, recentOrdersRes, customersRes, productsRes] =
      await Promise.all([
        supabase
          .from("orders")
          .select("total_price, status, created_at, product_id, quantity"),
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
        "Critical Fetch Error:",
        ordersRes.error || recentOrdersRes.error
      );
      return null;
    }

    const orders = ordersRes.data || [];

    const totalRevenue = orders.reduce(
      (acc, o) => acc + Number(o.total_price || 0),
      0
    );
    const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
      const s = o.status || "UNKNOWN";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const { data: allProducts } = await supabase
      .from("products")
      .select("id, name");
    const productLookup: Record<string, string> = {};
    allProducts?.forEach((p) => {
      productLookup[p.id] = p.name;
    });

    const salesMap: Record<string, number> = {};
    orders.forEach((order) => {
      const productName = productLookup[order.product_id] || "Unknown Product";
      const lineTotal = Number(order.total_price || 0);
      salesMap[productName] = (salesMap[productName] || 0) + lineTotal;
    });

    const topProducts = Object.entries(salesMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: orders.length,
      statusCounts,
      customerCount: customersRes.count || 0,
      productCount: productsRes.count || 0,
      recentOrders: recentOrdersRes.data || [],
      topProducts,
    };
  } catch (err) {
    console.error("Unexpected Dashboard Error:", err);
    return null;
  }
}
