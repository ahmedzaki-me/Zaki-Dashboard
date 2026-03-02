import { supabase } from "@/lib/supabase";

export const handlePlaceOrder = async (userId, cartItems, subTotal) => {
  const { data, error } = await supabase.rpc("place_new_order", {
    order_data: {
      user_id: userId,
      total_price: subTotal,
      status: "completed",
      payment_method: "cash",
    },
    items_data: cartItems.map((item) => ({
      item_id: item.id,
      quantity: item.count,
      unit_price: item.price,
    })),
  });

  if (error) {
    console.error("Order Error:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};
