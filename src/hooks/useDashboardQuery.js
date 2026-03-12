import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  stats: ["dashboard", "stats"],
};

export const dashboardQueries = {
  stats: () => ({
    queryKey: dashboardKeys.stats,
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke(
        "get-dashboard-stats",
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2,
  }),
};

export const useDashboardStats = () => useQuery(dashboardQueries.stats());
