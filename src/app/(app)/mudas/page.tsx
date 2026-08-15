import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { planOrchidLimit } from "@/lib/billing";
import { Card, CardTitle, Badge, Button } from "@/components/ui";

const STAGE_LABELS: Record<string, string> = {
  seedling: "Muda",
  juvenile: "Jovem",
  adult: "Adulta",
  blooming: "Florida",
};
const STAGE_TONE: Record<string, "neutral" | "green" | "bloom" | "amber"> = {
  seedling: "neutral",
  juvenile: "amber",
  adult: "green",
  blooming: "bloom",
};

export default async function MudasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;
  const orchids = await prisma.orchid.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const limit = planOrchidLimit(user.plan);
  const count = orchids.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-orchid-900">Minhas Mudas</h1>
          <p className="text-orchid-700">
            {count}
            {limit !== null ? ` / ${limit}` : ""} plantas no plano {user.plan}
          </p>
        </div>
        <div className="flex gap-2">
          {user.plan === "premium" && (
            <a href="/api/reports/mudas" download>
              <Button variant="secondary">Exportar CSV</Button>
            </a>
          )}
          <Link href="/mudas/novo">
            <Button>+ Nova muda</Button>
          </Link>
        </div>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {orchids.length === 0 ? (
        <Card className="text-center">
          <p className="text-orchid-700">Você ainda não cadastrou nenhuma muda.</p>
          <Link href="/mudas/novo" className="mt-3 inline-block">
            <Button>+ Cadastrar primeira muda</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orchids.map((o) => (
            <Link key={o.id} href={`/mudas/${o.id}`}>
              <Card className="h-full transition hover:border-orchid-300">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{o.name}</CardTitle>
                  <Badge tone={STAGE_TONE[o.stage] ?? "neutral"}>
                    {STAGE_LABELS[o.stage] ?? o.stage}
                  </Badge>
                </div>
                {o.species && <p className="text-sm text-orchid-700">{o.species}</p>}
                {o.hybrid && <p className="text-xs text-orchid-600">Híbrido: {o.hybrid}</p>}
                {o.location && (
                  <p className="mt-1 text-xs text-orchid-600">📍 {o.location}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
