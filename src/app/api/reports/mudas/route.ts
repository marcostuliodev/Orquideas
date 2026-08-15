import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Exportação CSV de relatório de mudas/plantas (recurso exclusivo do plano Premium).
// Separador ";", com BOM (\uFEFF) para o Excel interpretar corretamente os acentos.

function escapeCsv(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  // Campos que contêm ;, \n ou " são envolvidos em aspas duplas e as aspas
  // internas são duplicadas (RFC 4180), evitando quebra de colunas.
  if (value.includes(";") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: Request): Promise<Response> {
  const session = await getSession();
  if (!session) {
    return new Response("unauthorized", { status: 401 });
  }

  if (session.plan !== "premium") {
    return new Response("Plano Premium necessário", { status: 403 });
  }

  const orchids = await prisma.orchid.findMany({
    where: { userId: session.id },
    include: { careLogs: true },
    orderBy: { createdAt: "desc" },
  });

  const header =
    "Nome;Espécie;Híbrido;Origem;Estágio;Aquisição;Local;Lote;Genealogia;Notas;Total de cuidados";

  const rows = orchids.map((o) => {
    const acquiredAt = o.acquiredAt
      ? o.acquiredAt.toISOString().slice(0, 10)
      : "";
    return [
      escapeCsv(o.name),
      escapeCsv(o.species),
      escapeCsv(o.hybrid),
      escapeCsv(o.origin),
      escapeCsv(o.stage),
      escapeCsv(acquiredAt),
      escapeCsv(o.location),
      escapeCsv(o.batch),
      escapeCsv(o.parentInfo),
      escapeCsv(o.notes),
      String(o.careLogs.length),
    ].join(";");
  });

  const csv = [header, ...rows].join("\n");
  const bom = "\uFEFF";

  return new Response(bom + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mudas.csv"',
    },
  });
}
