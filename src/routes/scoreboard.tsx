import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HOUSES, scoresQuery } from "@/lib/houses";

export const Route = createFileRoute("/scoreboard")({
  head: () => ({
    meta: [
      { title: "CatHouse Score — Leaderboard" },
      { name: "description", content: "See which cat house has the most clicks." },
      { property: "og:title", content: "CatHouse Score — Leaderboard" },
      { property: "og:description", content: "See which cat house has the most clicks." },
    ],
  }),
  component: Scoreboard,
});

const MEDALS = ["🥇", "🥈", "🥉", "🎀"];

function Scoreboard() {
  const { data } = useQuery(scoresQuery);
  const ranked = [...HOUSES].map((h) => ({ ...h, clicks: data?.[h.id] ?? 0 })).sort((a, b) => b.clicks - a.clicks);
  const max = Math.max(1, ranked[0]?.clicks ?? 1);
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-center">
        <div className="text-6xl">🏆</div>
        <h1 className="mt-3 text-5xl font-bold">CatHouse Score</h1>
        <p className="mt-2 text-muted-foreground">Updates live as everyone clicks.</p>
      </div>
      <ol className="mt-10 space-y-4">
        {ranked.map((h, i) => (
          <li key={h.id}>
            <Link to="/house/$id" params={{ id: h.id }} className={`card-pop flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5 ${i === 0 ? "bg-primary text-primary-foreground" : ""}`}>
              <span className="w-10 text-center text-3xl">{MEDALS[i]}</span>
              <span className="font-display text-2xl font-bold">#{i + 1}</span>
              <span className="text-4xl">{h.emoji}</span>
              <div className="flex-1">
                <div className="font-display text-xl font-bold">{h.name}</div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${(h.clicks / max) * 100}%` }} />
                </div>
              </div>
              <span className="font-display text-2xl font-bold">{h.clicks.toLocaleString()}</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
