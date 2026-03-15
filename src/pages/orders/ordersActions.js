import { supabase } from "@/lib/supabase";

export const handlePlaceOrder = async (userId, cartItems, subTotal, status) => {
  const { data, error } = await supabase.rpc("place_new_order", {
    order_data: {
      user_id: userId,
      total_price: subTotal,
      status: status,
      payment_method: "cash",
    },
    items_data: cartItems.map((item) => ({
      item_id: item.id,
      quantity: item.count,
      unit_price: item.price,
      notes: item.notes,
      name: item.name,
      image_url: item.image_url,
      description: item.description,
    })),
  });

  if (error) {
    console.error("Order Error:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

export const ChangeStatus = async (newStatus, orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select();

  if (error) {
    console.error("Order Error:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};
