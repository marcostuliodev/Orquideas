import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveOrchidAction } from "@/lib/actions/orchids";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";

function toDateInput(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default async function EditarMudaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const orchid = await prisma.orchid.findFirst({ where: { id, userId: user.id } });
  if (!orchid) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/mudas/${orchid.id}`} className="text-sm text-orchid-600 hover:underline">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-orchid-900">Editar muda</h1>

      <Card className="mt-4">
        <form action={saveOrchidAction} className="space-y-4">
          <input type="hidden" name="id" value={orchid.id} />
          <div>
            <Label htmlFor="name">Nome de identificação *</Label>
            <Input id="name" name="name" required defaultValue={orchid.name} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="species">Espécie</Label>
              <Input id="species" name="species" defaultValue={orchid.species ?? ""} />
            </div>
            <div>
              <Label htmlFor="hybrid">Híbrido / Cultivar</Label>
              <Input id="hybrid" name="hybrid" defaultValue={orchid.hybrid ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="origin">Origem</Label>
              <Select id="origin" name="origin" defaultValue={orchid.origin ?? ""}>
                <option value="">—</option>
                <option value="compra">Compra</option>
                <option value="troca">Troca</option>
                <option value="seedling">Seedling</option>
                <option value="divisao">Divisão</option>
                <option value="autopolinizacao">Autopolinização</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="stage">Estágio</Label>
              <Select id="stage" name="stage" defaultValue={orchid.stage}>
                <option value="seedling">Muda</option>
                <option value="juvenile">Jovem</option>
                <option value="adult">Adulta</option>
                <option value="blooming">Florida</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="acquiredAt">Data de aquisição</Label>
              <Input id="acquiredAt" name="acquiredAt" type="date" defaultValue={toDateInput(orchid.acquiredAt)} />
            </div>
            <div>
              <Label htmlFor="location">Local (estufa/bancada)</Label>
              <Input id="location" name="location" defaultValue={orchid.location ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="batch">Lote (uso comercial)</Label>
              <Input id="batch" name="batch" defaultValue={orchid.batch ?? ""} />
            </div>
            <div>
              <Label htmlFor="parentInfo">Genealogia / genética</Label>
              <Input id="parentInfo" name="parentInfo" defaultValue={orchid.parentInfo ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" name="notes" rows={3} defaultValue={orchid.notes ?? ""} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Link href={`/mudas/${orchid.id}`}>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
