import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getHouse, scoresQuery, type HouseId } from "@/lib/houses";

export const Route = createFileRoute("/house/$id")({
  loader: ({ params }) => {
    const house = getHouse(params.id);
    if (!house) throw notFound();
    return { house };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.house.name ?? "Cat House";
    return {
      meta: [
        { title: `${name} — Cat Clicker` },
        { name: "description", content: `Click to pop cats and boost the ${name} score.` },
        { property: "og:title", content: `${name} — Cat Clicker` },
        { property: "og:description", content: `Click to pop cats and boost the ${name} score.` },
      ],
    };
  },
  component: HousePage,
});

type Pop = { id: number; x: number; y: number; e: string; r: number };

function HousePage() {
  const { house } = Route.useLoaderData();
  const qc = useQueryClient();
  const { data } = useQuery(scoresQuery);
  const [pops, setPops] = useState<Pop[]>([]);
  const [pending, setPending] = useState(0);
  const [mine, setMine] = useState(0);
  const [bump, setBump] = useState(0);
  const pendingRef = useRef(0);
  const nextId = useRef(0);

  const flush = async (id: HouseId) => {
    const n = Math.min(pendingRef.current, 200);
    if (!n) return;
    pendingRef.current -= n;
    setPending(pendingRef.current);
    const { data: total } = await supabase.rpc("add_clicks", { _house: id, _n: n });
    if (typeof total === "number") qc.setQueryData(["scores"], (old: Record<string, number> | undefined) => ({ ...old, [id]: total }));
  };

  useEffect(() => {
    setMine(0);
    const t = setInterval(() => flush(house.id), 1000);
    return () => { clearInterval(t); flush(house.id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house.id]);

  const onClick = (ev: React.PointerEvent) => {
    const id = nextId.current++;
    const e = house.pops[Math.floor(Math.random() * house.pops.length)] ?? "🐱";
    setPops((p) => [...p.slice(-40), { id, x: ev.clientX, y: ev.clientY, e, r: Math.random() * 40 - 20 }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
    pendingRef.current++;
    setPending(pendingRef.current);
    setMine((m) => m + 1);
    setBump((b) => b + 1);
  };

  const total = (data?.[house.id] ?? 0) + pending;

  return (
    <main className={`relative min-h-[calc(100vh-80px)] ${house.accentBg} cursor-pointer select-none overflow-hidden`} onPointerDown={onClick}>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-10 text-center">
        <div className="relative">
          <span className={`absolute -left-16 -top-6 -rotate-12 text-5xl animate-wiggle ${house.accentInk}`} style={{ animationDelay: "0.2s" }}>{house.cats[1]}</span>
          <span className={`absolute -right-16 -top-4 rotate-12 text-5xl animate-wiggle ${house.accentInk}`} style={{ animationDelay: "0.6s" }}>{house.cats[2]}</span>
          <span className={`absolute -left-20 top-14 rotate-6 text-4xl animate-wiggle ${house.accentInk}`} style={{ animationDelay: "1s" }}>{house.cats[3]}</span>
          <span className={`absolute -right-20 top-16 -rotate-6 text-4xl animate-wiggle ${house.accentInk}`} style={{ animationDelay: "1.4s" }}>{house.cats[4]}</span>
          <span className={`absolute left-10 -top-12 text-4xl animate-wiggle ${house.accentInk}`} style={{ animationDelay: "0.9s" }}>{house.cats[5]}</span>
          <span className={`absolute right-10 -top-14 text-4xl animate-wiggle ${house.accentInk}`} style={{ animationDelay: "0.4s" }}>{house.cats[6]}</span>
          <div className={`text-8xl animate-wiggle ${house.accentInk}`}>{house.emoji}</div>
        </div>
        <h1 className={`mt-4 text-4xl font-bold ${house.accentInk}`}>{house.name}</h1>
        <div className={`mt-2 flex gap-1 text-4xl ${house.accentInk}`}>
          {house.cats.map((c, i) => (
            <span key={i} className="animate-wiggle" style={{ animationDelay: `${i * 0.12}s` }}>{c}</span>
          ))}
        </div>
        <div key={bump} className={`mt-6 animate-bump font-display text-7xl font-bold sm:text-8xl ${house.accentInk}`}>
          {total.toLocaleString()}
        </div>
        <p className={`font-bold ${house.accentInk}`}>total house clicks</p>
        <div className={`card-pop mt-10 px-8 py-6`}>
          <p className="text-lg font-bold">Click anywhere! 🐾</p>
          <p className="text-muted-foreground">Your clicks this visit: <b className="text-foreground">{mine}</b></p>
        </div>
      </div>
      {pops.map((p) => (
        <span key={p.id} className="pointer-events-none fixed z-50 text-4xl animate-pop-float"
          style={{ left: p.x, top: p.y, ["--r" as string]: `${p.r}deg` }}>{p.e}</span>
      ))}
    </main>
  );
}
