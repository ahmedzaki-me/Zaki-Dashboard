import { getOrders, getOrderItems, getProfiles } from "@/lib/supabase";

export const ordersLoader = async () => {
  try {
    const [orders, orderItems, profiles] = await Promise.all([
      getOrders(),
      getOrderItems(),
      getProfiles(),
    ]);

    return { orders, orderItems, profiles };
  } catch (error) {
    throw new Response("Failed to load menu data", { status: 500 });
  }
};
