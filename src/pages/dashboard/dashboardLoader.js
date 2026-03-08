import { supabase } from "@/lib/supabase";

export const dashboardLoader = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    console.log("Not authenticated");
  }

  const { data, error } = await supabase.functions.invoke(
    "get-dashboard-stats",
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    },
  );

  if (error) {
    console.log(error);
  }

  return data;
};
