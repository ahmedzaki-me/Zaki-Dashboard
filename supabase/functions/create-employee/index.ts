
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
);

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

if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
  throw new Error("Not allowed");
}

  const { email, password, name, role, avatar_url } = await req.json()

if (profile.role === "admin" && (role === "admin" || role === "owner")){
  throw new Error("Admins cannot create admin or owner accounts");
}

if (profile.role === "owner" && role === "owner"){
  throw new Error("Owner account cannot create another owner");
}

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, 
      user_metadata: { full_name: name, role, avatar_url }
    })

    if (error) throw error

    return new Response(JSON.stringify(data), {
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