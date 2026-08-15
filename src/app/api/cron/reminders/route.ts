import { expandRecurringReminders } from "@/lib/reminders/scheduler";

// GET/POST protegidos por header `x-cron-secret`.
// Se CRON_SECRET não estiver definido, aceita qualquer chamada (apenas dev) e loga aviso.

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.warn(
      "[cron/reminders] CRON_SECRET não definido — aceitando qualquer chamada (apenas dev).",
    );
    return true;
  }
  const provided = req.headers.get("x-cron-secret");
  return provided === secret;
}

async function run(): Promise<Response> {
  const expanded = await expandRecurringReminders();
  return Response.json({ expanded });
}

export async function GET(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return new Response("unauthorized", { status: 401 });
  }
  return run();
}

export async function POST(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return new Response("unauthorized", { status: 401 });
  }
  return run();
}
