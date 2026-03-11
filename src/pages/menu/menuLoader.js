import { getItems, getCategories } from "@/lib/supabase";

export const menuLoader = async () => {
  try {
    const [items, categories] = await Promise.all([
      getItems(),
      getCategories(),
    ]);

    return { items, categories };
  } catch (error) {
    throw new Response("Failed to load menu data", { status: 500 });
  }
};
