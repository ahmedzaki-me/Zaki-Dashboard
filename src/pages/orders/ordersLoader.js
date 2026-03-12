import { queryClient } from "@/lib/queryClient";
import { ordersQueries } from "@/hooks/useOrdersQuery";

export const ordersLoader = async () => {
  const [orders, orderItems, profiles] = await Promise.all([
    queryClient.ensureQueryData(ordersQueries.orders()),
    queryClient.ensureQueryData(ordersQueries.orderItems()),
    queryClient.ensureQueryData(ordersQueries.profiles()),
  ]);
  return { orders, orderItems, profiles };
};
