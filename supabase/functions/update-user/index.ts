
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
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user: requester }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !requester) throw new Error("Unauthorized");

    const { data: requesterProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single();

    if (!requesterProfile || (requesterProfile.role !== "admin" && requesterProfile.role !== "owner")) {
      throw new Error("Not allowed: You must be an admin or owner");
    }

    const { userId, email, password, name, role, avatar_url } = await req.json();
    if (!userId) throw new Error("User ID is required for update");

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!targetProfile) throw new Error("Target user not found");

    if (requesterProfile.role === "admin") {
      const isSelf = requester.id === userId; 

      if (!isSelf && (targetProfile.role === "admin" || targetProfile.role === "owner")) {
        throw new Error("Admins cannot update other admins or owners");
      }
      if (role === "admin" || role === "owner") {
        throw new Error("Admins cannot promote users to admin or owner roles");
      }
}

if (role === "owner" && requester.id !== userId) {
  throw new Error("Cannot promote another user to owner.");
}

if (requesterProfile.role === "owner" && requester.id === userId && role && role !== "owner") {
  throw new Error("Owner cannot downgrade their own role");
}

  const userMetadata: any = {};
    if (name) userMetadata.full_name = name;
    if (role) userMetadata.role = role;
    if (avatar_url) userMetadata.avatar_url = avatar_url;

    const updateData: any = {};
    if (Object.keys(userMetadata).length > 0) updateData.user_metadata = userMetadata;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    updateData.email_confirm = true;

    const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, updateData);
    if (updateError) throw updateError;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
