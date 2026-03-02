import "@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

const authHeader = req.headers.get("Authorization");
if (!authHeader) throw new Error("Missing auth header");
const supabaseUser = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  {
    global: {
      headers: { Authorization: authHeader },
    },
  }
);
const {
  data: { user },
} = await supabaseUser.auth.getUser();

if (!user) throw new Error("Unauthorized");
const { data: profile } = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (!profile || ( profile.role !== "admin" && profile.role !== "owner")) {
  throw new Error("Not allowed");
}

    const { userId } = await req.json()
    if (!userId) {
      throw new Error('User ID is required')
    }
    if (user.id === userId) {
  throw new Error("You cannot delete your own account");
}
const { data: targetProfile } = await supabaseAdmin
  .from("profiles")
  .select("role")
  .eq("id", userId)
  .single();

if (!targetProfile) {
  throw new Error("Target user not found");
}
if (targetProfile.role === "owner") {
  throw new Error("Owner account cannot be deleted");
}
if (
  targetProfile.role === "admin" &&
  profile.role !== "owner"
) {
  throw new Error("Admins cannot delete other admins");
}
const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);


const avatarUrl = userData?.user?.user_metadata?.avatar_url;
try {
  if (avatarUrl) {
    const fileName = avatarUrl.split('/').pop();
    await supabaseAdmin.storage.from('avatars').remove([fileName]);
  }
} catch (e) {
  console.log("Avatar delete failed:", e);
}

    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) throw error
    return new Response(JSON.stringify({ message: 'User deleted successfully', data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})