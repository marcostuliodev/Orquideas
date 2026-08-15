import { requireUser } from "@/lib/auth";
import { getAcervoMetrics } from "@/lib/analytics";
import { Card, CardTitle, Badge } from "@/components/ui";
import { BarChart } from "@/components/analytics/BarChart";
import { monthLabel } from "@/lib/utils";

const STAGE_LABELS: Record<string, string> = {
  seedling: "Muda",
  juvenile: "Jovem",
  adult: "Adulta",
  blooming: "Florida",
};

export default async function AnalyticsPage() {
  const user = await requireUser();
  const m = await getAcervoMetrics(user.id);

  const chartData = m.eventsByMonth.map((e) => ({
    label: monthLabel(Number(e.month.split("-")[1])),
    value: e.count,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-orchid-900">Analytics do acervo</h1>
        <p className="text-orchid-700">
          Visão geral da saúde e da atividade do seu cultivo.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardTitle className="text-base">Total de plantas</CardTitle>
          <p className="mt-2 text-3xl font-bold text-orchid-900">{m.total}</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Em floração</CardTitle>
          <p className="mt-2 text-3xl font-bold text-bloom-500">{m.bloomCount}</p>
          <p className="text-sm text-orchid-700">{m.bloomRate}% do acervo</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Aderência de cuidados</CardTitle>
          <p className="mt-2 text-3xl font-bold text-leaf-500">{m.careCompliance}%</p>
          <p className="text-sm text-orchid-700">lembretes concluídos</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Distribuição por estágio</CardTitle>
          <div className="mt-2 space-y-1">
            {Object.keys(m.byStage).length === 0 ? (
              <p className="text-sm text-orchid-700">Sem plantas.</p>
            ) : (
              Object.entries(m.byStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between text-sm">
                  <span className="text-orchid-700">{STAGE_LABELS[stage] ?? stage}</span>
                  <Badge tone="neutral">{count}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle className="text-base">Eventos de cultivo (últimos 6 meses)</CardTitle>
        <div className="mt-4">
          <BarChart data={chartData} />
        </div>
      </Card>
    </div>
  );
}
