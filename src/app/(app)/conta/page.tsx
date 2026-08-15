import { requireUser } from "@/lib/auth";
import { PLANS, getPlan } from "@/lib/billing";
import { subscribeAction, cancelSubscriptionAction } from "@/lib/actions/billing";
import { Card, CardTitle, Badge, Button, Input, Label } from "@/components/ui";

export default async function ContaPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const user = await requireUser();
  const { success, error } = await searchParams;
  const current = getPlan(user.plan);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-orchid-900">Minha Conta</h1>
        <p className="text-orchid-700">{user.email}</p>
      </header>

      {success && (
        <div className="rounded-lg bg-leaf-500/10 px-3 py-2 text-sm text-leaf-500">{success}</div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <Card>
        <CardTitle className="text-base">Plano atual</CardTitle>
        <div className="mt-2 flex items-center gap-3">
          <Badge tone={user.plan === "free" ? "neutral" : "green"}>{current.name}</Badge>
          <span className="text-sm text-orchid-700">
            {current.priceBRL === 0 ? "Grátis" : `R$ ${current.priceBRL.toFixed(2)}/mês`}
          </span>
        </div>
        {user.plan !== "free" && (
          <form action={cancelSubscriptionAction} className="mt-3">
            <Button variant="danger" type="submit">
              Cancelar assinatura
            </Button>
          </form>
        )}
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-orchid-800">Planos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === user.plan;
            return (
              <Card key={plan.id} className={isCurrent ? "border-orchid-400 ring-2 ring-orchid-200" : ""}>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="mt-1 text-2xl font-bold text-orchid-900">
                  {plan.priceBRL === 0 ? "Grátis" : `R$ ${plan.priceBRL.toFixed(2)}`}
                  {plan.priceBRL > 0 && <span className="text-sm font-normal text-orchid-600">/mês</span>}
                </p>
                <p className="mt-1 text-sm text-orchid-700">{plan.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-orchid-700">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  {isCurrent ? (
                    <Badge tone="green">Plano atual</Badge>
                  ) : (
                    <form action={subscribeAction} className="space-y-2">
                      <input type="hidden" name="planId" value={plan.id} />
                      {plan.id !== "free" && (
                        <div>
                          <Label htmlFor={`cpf-${plan.id}`}>CPF/CNPJ</Label>
                          <Input
                            id={`cpf-${plan.id}`}
                            name="cpfCnpj"
                            defaultValue={user.cpfCnpj ?? ""}
                            placeholder="000.000.000-00"
                            inputMode="numeric"
                            required
                          />
                        </div>
                      )}
                      <Button type="submit" className="w-full" variant={plan.id === "free" ? "secondary" : "primary"}>
                        {plan.id === "free" ? "Voltar ao Iniciante" : "Assinar"}
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-orchid-600">
          Pagamentos processados via Asaas (BR). Sem chave configurada, o MVP simula a assinatura
          localmente — preencha <code>ASAAS_API_KEY</code> no <code>.env</code> para ativar o gateway real.
        </p>
      </section>
    </div>
  );
}
