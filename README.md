# Finanças Pessoais

App de gestão financeira pessoal com Next.js 14, Supabase e Recharts.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI**: shadcn/ui (componentes customizados)
- **Gráficos**: Recharts
- **Backend/Auth**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: Vercel

## Funcionalidades

- Autenticação via Supabase Auth (email/senha)
- Dashboard com resumo mensal (receitas, despesas, saldo)
- Gráfico de pizza por categoria (Recharts)
- Listagem de transações com filtros (tipo, categoria, período)
- CRUD de transações (adicionar, editar, excluir)
- Navegação responsiva mobile-first

## Setup

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/migration.sql`
3. Em **Project Settings > API**, copie a URL e a Anon Key

### 2. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha `.env.local` com seus dados do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 4. Deploy na Vercel

1. Push para GitHub
2. Importe o repositório na Vercel
3. Adicione as variáveis de ambiente no painel da Vercel
4. Deploy automático

## Estrutura

```
src/
├── app/
│   ├── (auth)/          # Login e Signup
│   └── (app)/           # Dashboard e Transações
├── components/
│   ├── auth/            # Formulários de autenticação
│   ├── dashboard/       # Cards, gráfico, últimas transações
│   ├── layout/          # Sidebar + header mobile
│   ├── transactions/    # Lista, filtros, modal, confirmação
│   └── ui/              # Componentes base (shadcn/ui)
├── hooks/               # useTransactions, useToast
├── lib/
│   ├── supabase/        # Cliente browser e server
│   └── utils.ts         # Formatação, categorias, cores
└── types/               # Interfaces TypeScript
```
