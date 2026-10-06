import { supabase } from "@/integrations/supabase/client";

export type HouseId = "white" | "black" | "orange" | "calico";

export const HOUSES: {
  id: HouseId;
  name: string;
  emoji: string;
  pops: string[];
  cats: string[];
  tagline: string;
  accentBg: string;
  accentInk: string;
  accentChip: string;
}[] = [
  {
    id: "white",
    name: "White Cat House",
    emoji: "🐈",
    pops: ["🐈", "😺", "😸", "🤍", "🐾", "😽", "🐱", "✨"],
    cats: ["🐈", "😺", "😽", "🐱", "🤍", "🐾", "😸", "✨"],
    tagline: "Soft, fluffy and calm",
    accentBg: "bg-house-white",
    accentInk: "text-house-white-ink",
    accentChip: "bg-white/70 text-house-white-ink",
  },
  {
    id: "black",
    name: "Black Cat House",
    emoji: "🐈‍⬛",
    pops: ["🐈‍⬛", "😼", "😾", "🖤", "🐾", "🐱", "🌙", "✨"],
    cats: ["🐈‍⬛", "😼", "😾", "🐱", "🖤", "🐾", "🌙", "✨"],
    tagline: "Mysterious midnight purrs",
    accentBg: "bg-house-black",
    accentInk: "text-house-black-ink",
    accentChip: "bg-white/15 text-house-black-ink",
  },
  {
    id: "orange",
    name: "Orange Cat House",
    emoji: "🐱",
    pops: ["🐱", "😸", "😻", "🧡", "🐾", "🐈", "😽", "🍊"],
    cats: ["🐱", "😸", "😻", "🐈", "🧡", "🐾", "😽", "🍊"],
    tagline: "One brain cell, all heart",
    accentBg: "bg-house-orange",
    accentInk: "text-house-orange-ink",
    accentChip: "bg-white/70 text-house-orange-ink",
  },
  {
    id: "calico",
    name: "Calico Cat House",
    emoji: "😻",
    pops: ["😻", "😽", "🐱", "🌸", "🐾", "😺", "💕", "🐈"],
    cats: ["😻", "😽", "🐱", "😺", "🌸", "🐾", "💕", "🐈"],
    tagline: "A little bit of everything",
    accentBg: "bg-house-calico",
    accentInk: "text-house-calico-ink",
    accentChip: "bg-white/70 text-house-calico-ink",
  },
];

export const getHouse = (id: string) => HOUSES.find((h) => h.id === id);

export async function fetchScores(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("house_clicks").select("house, clicks");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.house, Number(r.clicks)]));
}

export const scoresQuery = { queryKey: ["scores"], queryFn: fetchScores, refetchInterval: 4000 };
