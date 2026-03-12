import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrderItems, getProfiles } from "@/lib/supabase";

export const ordersKeys = {
  orders: ["orders"],
  orderItems: ["orderItems"],
  profiles: ["profiles"],
};

export const ordersQueries = {
  orders: () => ({
    queryKey: ordersKeys.orders,
    queryFn: getOrders,
  }),
  orderItems: () => ({
    queryKey: ordersKeys.orderItems,
    queryFn: getOrderItems,
  }),
  profiles: () => ({
    queryKey: ordersKeys.profiles,
    queryFn: getProfiles,
  }),
};

export const useOrders = () => useQuery(ordersQueries.orders());
export const useOrdersItems = () => useQuery(ordersQueries.orderItems());
export const useProfiles = () => useQuery(ordersQueries.profiles());
