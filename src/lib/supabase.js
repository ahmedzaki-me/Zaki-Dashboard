import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export const getCurrentUser = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return { ...session.user, ...profile };
};

const fetchData = async (
  table,
  errorMessage,
  sortColumn = "id",
  ascending = true,
) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(sortColumn, { ascending });
  if (error) {
    console.error(`Error fetching ${table}:`, error.message);
    throw new Error(errorMessage);
  }
  return data || [];
};

export const getItems = () => fetchData("items", "تعذر جلب العناصر");
export const getCategories = () =>
  fetchData("categories", "تعذر جلب التصنيفات");
export const getOrders = () =>
  fetchData("orders", "تعذر جلب الطلبات", "invoice", true);
export const getProfiles = () =>
  fetchData("profiles", "تعذر جلب المستخدمين", "role", true);
