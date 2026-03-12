import { queryClient } from "@/lib/queryClient";
import { menuQueries } from "@/hooks/useMenuQuery";

export const menuLoader = async () => {
  const [items, categories] = await Promise.all([
    queryClient.ensureQueryData(menuQueries.items()),
    queryClient.ensureQueryData(menuQueries.categories()),
  ]);
  return { items, categories };
};
