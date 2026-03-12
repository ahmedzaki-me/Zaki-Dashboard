import { queryClient } from "@/lib/queryClient";
import { dashboardQueries } from "@/hooks/useDashboardQuery";

export const dashboardLoader = async () => {
  return queryClient.ensureQueryData(dashboardQueries.stats());
};
