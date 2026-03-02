import { getProfiles } from "../../lib/supabase";

export const employeesLoader = async () => {
  try {
    const profiles = await getProfiles();

    return { profiles };
  } catch (error) {
    throw new Response("Failed to load menu data", { status: 500 });
  }
};
