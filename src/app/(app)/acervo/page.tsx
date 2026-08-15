import Link from "next/link";
import { TOPICS } from "@/lib/content/topics";
import { CULTIVATION_STEPS } from "@/lib/content/steps";
import { GROWTH_PHASES } from "@/lib/content/growthPhases";
import { Card, CardTitle, Badge } from "@/components/ui";

export default function AcervoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-orchid-900">Acervo de Cultivo</h1>
        <p className="text-orchid-700">
          Conhecimento prático para levar sua orquídea do seedling à floração.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Passo a passo para iniciantes</h2>
        <ol className="grid gap-3 md:grid-cols-2">
          {CULTIVATION_STEPS.map((step) => (
            <li key={step.order}>
              <Card className="h-full">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orchid-600 text-sm font-bold text-white">
                    {step.order}
                  </span>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                </div>
                <p className="mt-2 text-sm text-orchid-700">{step.summary}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Tópicos principais</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <Link key={topic.slug} href={`/acervo/${topic.slug}`}>
              <Card className="h-full transition hover:border-orchid-300">
                <div className="text-3xl">{topic.icon}</div>
                <CardTitle className="mt-2">{topic.title}</CardTitle>
                <p className="mt-1 text-sm text-orchid-700">{topic.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Fases do crescimento</h2>
        <div className="space-y-3">
          {GROWTH_PHASES.map((phase) => (
            <Card key={phase.slug} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 sm:w-64">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orchid-100 text-sm font-bold text-orchid-700">
                  {phase.order}
                </span>
                <div>
                  <div className="font-semibold text-orchid-900">{phase.title}</div>
                  <Badge tone="neutral">{phase.durationHint}</Badge>
                </div>
              </div>
              <p className="text-sm text-orchid-700">{phase.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
