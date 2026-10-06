const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HOUSES = [
  { id: "white", name: "White Cat House", emoji: "🐈", tagline: "Soft, fluffy and calm" },
  { id: "black", name: "Black Cat House", emoji: "🐈‍⬛", tagline: "Mysterious midnight purrs" },
  { id: "orange", name: "Orange Cat House", emoji: "🐱", tagline: "One brain cell, all heart" },
  { id: "calico", name: "Calico Cat House", emoji: "😻", tagline: "A little bit of everything" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  return new Response(JSON.stringify(HOUSES), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});