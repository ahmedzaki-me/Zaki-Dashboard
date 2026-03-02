import { getOrders, getProfiles } from "../../lib/supabase";

export const ordersLoader = async () => {
  try {
    const [orders, profiles] = await Promise.all([getOrders(), getProfiles()]);

    return { orders, profiles };
  } catch (error) {
    throw new Response("Failed to load menu data", { status: 500 });
  }
};
