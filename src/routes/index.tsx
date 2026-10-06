import { createFileRoute, Link } from "@tanstack/react-router";
import { HOUSES } from "@/lib/houses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cat Clicker — Pick Your Cat House" },
      { name: "description", content: "Choose a cat house and click away your stress. Every click pops a cat!" },
      { property: "og:title", content: "Cat Clicker — Pick Your Cat House" },
      { property: "og:description", content: "Choose a cat house and click away your stress." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center">
        <div className="text-6xl animate-wiggle inline-block">🐾</div>
        <h1 className="mt-4 text-5xl font-bold sm:text-6xl">Click away your stress</h1>
        <p className="mt-3 text-lg text-muted-foreground">Pick a cat house, then click as much as you like. Every click counts for your house!</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {HOUSES.map((h) => (
          <Link key={h.id} to="/house/$id" params={{ id: h.id }}
            className={`card-pop ${h.accentBg} group relative overflow-hidden p-6 transition-transform hover:-translate-y-1 hover:shadow-pop-lg`}>
            <span className={`text-6xl transition-transform group-hover:scale-110 ${h.accentInk}`}>{h.emoji}</span>
            <h2 className={`mt-4 text-2xl font-bold ${h.accentInk}`}>{h.name}</h2>
            <p className={`opacity-90 ${h.accentInk}`}>{h.tagline}</p>
            <div className="mt-5 flex gap-1 text-3xl">
              {h.cats.slice(0, 5).map((c, i) => (
                <span key={i} className="animate-wiggle" style={{ animationDelay: `${i * 0.15}s` }}>{c}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
