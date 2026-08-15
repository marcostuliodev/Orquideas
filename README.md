# 🌸 Orquídeas — Micro SaaS de Cultivo

Plataforma para quem cultiva orquídeas: acervo de cultivo passo a passo, calendário
sazonal, clima por região (sem API externa) e controle completo de mudas — do
seedling à floração.

## Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma** + **SQLite** em dev (schema pronto para Postgres em produção)
- **Auth** própria (bcrypt + JWT em cookie httpOnly via `jose`) — sem dependência de beta
- **Billing** abstraído para **Asaas** (BR), com modo simulação sem chave
- **Clima** 100% local (normais climáticas BR embutidas) — sem API/token

## Setup
```bash
npm install
cp .env.example .env          # ajuste AUTH_SECRET (openssl rand -base64 32)
npx prisma db push            # cria o banco SQLite
npm run db:seed               # usuário demo
npm run dev                   # http://localhost:3000
```
Login demo: `demo@orquideas.com` / `demo123`

## Estrutura
```
src/
  app/
    page.tsx                  # landing
    login, registro           # auth
    (app)/                    # área autenticada (AppShell + sidebar)
      acervo, acervo/[slug]   # conteúdo de cultivo
      calendario              # 4 estações
      clima                   # normais + alertas + observações
      mudas, mudas/novo, mudas/[id], mudas/[id]/edit
      conta                   # planos e assinatura
  lib/
    db.ts, auth.ts, billing.ts
    climate/{types,data,engine}.ts
    content/{types,topics,growthPhases,steps,calendar}.ts
    actions/{auth,orchids,observations,billing}.ts
  components/{ui,layout,Markdown}.tsx
prisma/{schema.prisma,seed.ts}
```

## Decisões (ADRs)
1. **Sem API de clima/token** — motor de normais climáticas BR embutidas (5 regiões ×
   12 meses + 28 cidades). Upgrade opcional: Open-Meteo (sem token) como fonte de
   dados ao vivo, mantendo o mesmo contrato.
2. **Auth própria** em vez de NextAuth beta — controle total, menos superfície de
   falha; social login pode ser plugado depois.
3. **SQLite em dev / Postgres em prod** — trocar `provider` no `schema.prisma` e a
   `DATABASE_URL`. Enums/arrays modelados como `String`/`Json` para portabilidade.
4. **Asaas com fallback local** — billing funciona no MVP sem credenciais; ao
   preencher `ASAAS_API_KEY` o gateway real é ativado (webhook documentado).

## Entregas adicionais (2ª iteração)
- **Fenômenos climáticos (ENSO):** módulo `lib/climate/phenomena.ts` com El Niño, La Niña e
  **Super El Niño de 2026**; ajusta as normais regionais e gera alertas específicos para orquídeas.
  Em destaque na aba **Clima & Alertas** e como tópico no acervo.
- **Clima ao vivo (Open-Meteo, sem token):** `lib/climate/live.ts` busca condições atuais por
  cidade (geocoding + forecast) e alimenta os alertas; cai para as normais locais se a rede falhar.
- **Upload real de fotos:** `lib/actions/uploads.ts` salva imagens em `public/uploads` (com
  validação de tipo/tamanho) e permite remover; `public/uploads/` está no `.gitignore`.
- **PWA / offline:** `public/manifest.webmanifest`, `public/sw.js`, `public/icon.svg` e
  `components/ServiceWorker.tsx` (registrado no root layout).
- **Webhook Asaas:** `app/api/webhooks/asaas/route.ts` confirma pagamentos e atualiza plano/status
  (protegido por `ASAAS_WEBHOOK_TOKEN`).
- **Relatórios CSV (Premium):** `app/api/reports/mudas/route.ts` exporta as mudas do usuário;
  botão visível na lista para plano `premium`.

## Roadmap (pós-MVP)
- Histórico de estações com séries do Open-Meteo
- Notificações push (lembretes) via PWA
- App mobile nativo / React Native
- Storage em nuvem (S3) para fotos em produção
