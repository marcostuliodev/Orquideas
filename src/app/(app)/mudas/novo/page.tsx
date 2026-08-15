import Link from "next/link";
import { saveOrchidAction } from "@/lib/actions/orchids";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";

export default async function NovaMudaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/mudas" className="text-sm text-orchid-600 hover:underline">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-orchid-900">Nova muda / planta</h1>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <Card className="mt-4">
        <form action={saveOrchidAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome de identificação *</Label>
            <Input id="name" name="name" required placeholder="Ex.: Phal. branca da varanda" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="species">Espécie</Label>
              <Input id="species" name="species" placeholder="Ex.: Phalaenopsis" />
            </div>
            <div>
              <Label htmlFor="hybrid">Híbrido / Cultivar</Label>
              <Input id="hybrid" name="hybrid" placeholder="Ex.: Phal. amabilis" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="origin">Origem</Label>
              <Select id="origin" name="origin" defaultValue="">
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
              <Select id="stage" name="stage" defaultValue="seedling">
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
              <Input id="acquiredAt" name="acquiredAt" type="date" />
            </div>
            <div>
              <Label htmlFor="location">Local (estufa/bancada)</Label>
              <Input id="location" name="location" placeholder="Ex.: Estufa A" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="batch">Lote (uso comercial)</Label>
              <Input id="batch" name="batch" placeholder="Ex.: Lote-2025-01" />
            </div>
            <div>
              <Label htmlFor="parentInfo">Genealogia / genética</Label>
              <Input id="parentInfo" name="parentInfo" placeholder="Ex.: Pai A x Mãe B" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
          <p className="text-xs text-orchid-600">
            💡 As fotos são enviadas depois, na página da muda (botão “Enviar fotos”).
          </p>
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Link href="/mudas">
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
