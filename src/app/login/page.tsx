import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button, Card, Input, Label } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-4 text-center text-2xl font-bold text-orchid-800">🌸 Entrar</div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/mudas"} />
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-orchid-700">
          Não tem conta?{" "}
          <Link href="/registro" className="font-medium text-orchid-600 underline">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}
