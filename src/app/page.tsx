import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button, Card } from "@/components/ui";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/mudas");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold text-orchid-800">
          <span>🌸</span> Orquídeas
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/registro">
            <Button>Criar conta</Button>
          </Link>
        </div>
      </header>

      <section className="mt-16 text-center">
        <h1 className="text-4xl font-bold text-orchid-900 md:text-5xl">
          Cultive orquídeas com método e clima a favor
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-orchid-700">
          Acervo de cultivo passo a passo, calendário sazonal, clima por região e o
          controle completo das suas mudas — do seedling à floração.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/registro">
            <Button className="px-6 py-3 text-base">Começar grátis</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="px-6 py-3 text-base">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-4">
        {[
          { icon: "📚", title: "Acervo de Cultivo", text: "Luz, rega, adubação, pragas, doenças, ambiente e estufa." },
          { icon: "🗓️", title: "Calendário Sazonal", text: "O que fazer em cada estação do ano no Brasil." },
          { icon: "🌤️", title: "Clima & Alertas", text: "Normais por região e alertas de cultivo sem API externa." },
          { icon: "🌿", title: "Controle de Mudas", text: "Inventário, cuidados, lembretes e genealogia." },
        ].map((f) => (
          <Card key={f.title}>
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-2 font-semibold text-orchid-900">{f.title}</h3>
            <p className="mt-1 text-sm text-orchid-700">{f.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
