import Link from "next/link";
import { notFound } from "next/navigation";
import { TOPICS } from "@/lib/content/topics";
import { SEASONS } from "@/lib/content/calendar";
import { Card, CardTitle, Badge } from "@/components/ui";
import { Markdown } from "@/components/Markdown";

const SEASON_NAMES: Record<string, string> = {
  verao: "Verão",
  outono: "Outono",
  inverno: "Inverno",
  primavera: "Primavera",
};

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/acervo" className="text-sm text-orchid-600 hover:underline">
        ← Voltar ao acervo
      </Link>

      <header className="flex items-center gap-3">
        <span className="text-4xl">{topic.icon}</span>
        <div>
          <CardTitle className="text-2xl">{topic.title}</CardTitle>
          <p className="text-orchid-700">{topic.summary}</p>
        </div>
      </header>

      <Card>
        <Markdown content={topic.content} />
      </Card>

      {topic.seasonTips && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-orchid-800">Dicas por estação</h2>
          {Object.entries(topic.seasonTips).map(([season, tip]) => (
            <Card key={season} className="flex items-start gap-3">
              <Badge tone="green">{SEASON_NAMES[season]}</Badge>
              <p className="text-sm text-orchid-700">{tip}</p>
            </Card>
          ))}
        </section>
      )}

      <section>
        <h2 className="mb-2 text-lg font-semibold text-orchid-800">No calendário</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SEASONS.map((s) => (
            <Card key={s.slug}>
              <CardTitle className="text-base">{s.name}</CardTitle>
              <p className="mt-1 text-sm text-orchid-700">{s.daylight}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
