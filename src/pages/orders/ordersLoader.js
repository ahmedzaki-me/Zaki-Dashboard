import {
  getOrders,
  getOrderItems,
  getItems,
  getProfiles,
} from "@/lib/supabase";

export const ordersLoader = async () => {
  try {
    const [orders, orderItems, Items, profiles] = await Promise.all([
      getOrders(),
      getOrderItems(),
      getItems(),
      getProfiles(),
    ]);

    return { orders, orderItems, Items, profiles };
  } catch (error) {
    throw new Response("Failed to load menu data", { status: 500 });
  }
};
