import { requireUser } from "@/lib/auth";
import { unreadCount, listNotifications } from "@/lib/notifications";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notifications";
import { Card, Badge, Button } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

export default async function NotificacoesPage() {
  const user = await requireUser();
  const [unread, notifications] = await Promise.all([
    unreadCount(user.id),
    listNotifications(user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-orchid-900">Notificações</h1>
          <p className="text-orchid-700">
            {unread > 0 ? `${unread} não lida(s)` : "Tudo certo por aqui."}
          </p>
        </div>
        <form action={markAllNotificationsReadAction}>
          <Button type="submit" variant="secondary">
            Marcar todas como lidas
          </Button>
        </form>
      </header>

      {notifications.length === 0 ? (
        <Card>
          <p className="text-sm text-orchid-700">Nenhuma notificação ainda.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const isUnread = n.readAt === null;
            return (
              <li
                key={n.id}
                className={
                  "rounded-xl border p-4 " +
                  (isUnread
                    ? "border-bloom-500/40 bg-bloom-500/5"
                    : "border-orchid-100 bg-white")
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-orchid-900">{n.title}</span>
                      {isUnread && <Badge tone="bloom">Nova</Badge>}
                    </div>
                    {n.body && <p className="mt-1 text-sm text-orchid-700">{n.body}</p>}
                    <p className="mt-1 text-xs text-orchid-600">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {n.link && (
                      <a
                        href={n.link}
                        className="text-sm font-medium text-orchid-600 hover:underline"
                      >
                        Abrir
                      </a>
                    )}
                    {isUnread && (
                      <form action={markNotificationReadAction}>
                        <input type="hidden" name="id" value={n.id} />
                        <Button variant="ghost" type="submit" className="px-2 py-1 text-xs">
                          Marcar como lida
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
