import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button, Card, Input, Label } from "@/components/ui";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-4 text-center text-2xl font-bold text-orchid-800">🌸 Criar conta</div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <form action={registerAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required placeholder="Seu nome" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <div>
            <Label htmlFor="cpfCnpj">CPF/CNPJ (opcional)</Label>
            <Input id="cpfCnpj" name="cpfCnpj" placeholder="000.000.000-00" inputMode="numeric" />
            <p className="mt-1 text-xs text-orchid-600">
              Usado apenas para cobrança na Asaas. Você também pode informar depois, na conta.
            </p>
          </div>
          <Button type="submit" className="w-full">
            Criar conta
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-orchid-700">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-orchid-600 underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
