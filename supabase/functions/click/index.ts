import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.json();
  console.log("body received:", JSON.stringify(body));
  const house = body.house;
  const clicks = parseInt(body.clicks, 10);

  const validHouses = ["white", "black", "orange", "calico"];
  if (!validHouses.includes(house)) {
    return new Response(JSON.stringify({ error: "invalid house" }), { status: 400, headers: corsHeaders });
  }
  if (!clicks || clicks < 1 || clicks > 200) {
    return new Response(JSON.stringify({ error: "clicks must be 1-200" }), { status: 400, headers: corsHeaders });
  }

  const { data, error } = await supabase.rpc("add_clicks", { _house: house, _n: clicks });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });

  return new Response(JSON.stringify({ house, total: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});