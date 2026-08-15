import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { Badge } from "@/components/ui";
import { unreadCount } from "@/lib/notifications";
import { MobileNav } from "@/components/layout/MobileNav";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/mudas", label: "Minhas Mudas", icon: "🌿" },
  { href: "/acervo", label: "Acervo de Cultivo", icon: "📚" },
  { href: "/calendario", label: "Calendário Sazonal", icon: "🗓️" },
  { href: "/clima", label: "Clima & Alertas", icon: "🌤️" },
  { href: "/eventos", label: "Eventos", icon: "🌱" },
  { href: "/lembretes", label: "Lembretes", icon: "🔔" },
  { href: "/analytics", label: "Analytics", icon: "📊" },
  { href: "/notificacoes", label: "Notificações", icon: "✉️" },
  { href: "/conta", label: "Minha Conta", icon: "⚙️" },
];

export async function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const unread = await unreadCount(user.id);
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-orchid-100 bg-white p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="text-2xl">🌸</span>
          <span className="text-lg font-bold text-orchid-800">Orquídeas</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-orchid-700 hover:bg-orchid-50"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.href === "/notificacoes" && unread > 0 && (
                <Badge tone="bloom" className="ml-auto">
                  {unread}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-4">
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-orchid-600 hover:bg-orchid-50">
            Sair
          </button>
        </form>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-orchid-100 bg-white px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <MobileNav nav={NAV} unread={unread} />
            <span className="md:hidden text-xl font-bold text-orchid-800">🌸 Orquídeas</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Badge tone={user.plan === "free" ? "neutral" : "green"}>
              {user.plan === "free" ? "Iniciante" : user.plan === "pro" ? "Pro" : "Premium"}
            </Badge>
            <span className="text-sm text-orchid-700">{user.name}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
