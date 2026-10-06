import { supabase } from "@/integrations/supabase/client";

export type HouseId = "white" | "black" | "orange" | "calico";

export const HOUSES: { id: HouseId; name: string; emoji: string; pops: string[]; tagline: string; tone: string }[] = [
  { id: "white", name: "White Cat House", emoji: "🐈", pops: ["🐱", "😺", "🤍", "🐾"], tagline: "Soft, fluffy and calm", tone: "bg-card" },
  { id: "black", name: "Black Cat House", emoji: "🐈‍⬛", pops: ["🐈‍⬛", "😼", "🖤", "🐾"], tagline: "Mysterious midnight purrs", tone: "bg-ink text-background" },
  { id: "orange", name: "Orange Cat House", emoji: "🐱", pops: ["😸", "🧡", "🐱", "🐾"], tagline: "One brain cell, all heart", tone: "bg-primary text-primary-foreground" },
  { id: "calico", name: "Calico Cat House", emoji: "😻", pops: ["😻", "😽", "🌸", "🐾"], tagline: "A little bit of everything", tone: "bg-secondary" },
];

export const getHouse = (id: string) => HOUSES.find((h) => h.id === id);

export async function fetchScores(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("house_clicks").select("house, clicks");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.house, Number(r.clicks)]));
}

export const scoresQuery = { queryKey: ["scores"], queryFn: fetchScores, refetchInterval: 4000 };
