import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const house = url.searchParams.get("house");

  let query = supabase.from("house_clicks").select("house, clicks");
  if (house) query = query.eq("house", house);

  const { data, error } = await query;
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });

  const scores = Object.fromEntries((data ?? []).map((r) => [`${r.house}_score`, Number(r.clicks)]));
  return new Response(JSON.stringify(scores), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});