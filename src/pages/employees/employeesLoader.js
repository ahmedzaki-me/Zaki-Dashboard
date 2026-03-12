import { queryClient } from "@/lib/queryClient";
import { employeesQueries } from "@/hooks/useEmployeesQuery";
export const employeesLoader = async () => {
  const [profiles] = await Promise.all([
    queryClient.ensureQueryData(employeesQueries.profiles()),
  ]);
  return { profiles };
};
