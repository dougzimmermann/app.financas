"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Mail, ArrowRight, RefreshCw } from "lucide-react";

function EmailConfirmationScreen({ email }: { email: string }) {
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  async function handleResend() {
    setResending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao reenviar", description: error.message });
    } else {
      toast({ title: "E-mail reenviado!", description: "Verifique sua caixa de entrada." });
    }
  }

  return (
    <div className="animate-fade-in text-center">
      <div className="flex flex-col items-center mb-6">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-6">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>

        {/* Mail icon with glow */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Confirme seu e-mail</h1>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-xs">
          Enviamos um link de confirmação para
        </p>
        <p className="text-sm font-semibold text-foreground mt-1 break-all">{email}</p>
      </div>

      {/* Steps */}
      <div className="bg-muted rounded-xl p-4 text-left space-y-3 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Como confirmar
        </p>
        {[
          "Abra sua caixa de entrada",
          "Procure um e-mail de \"Finanças Pessoais\"",
          "Clique em \"Confirmar e-mail\"",
          "Volte aqui e faça seu login",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-foreground">{step}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-1">
        Não recebeu? Verifique o spam ou
      </p>
      <button
        onClick={handleResend}
        disabled={resending}
        className="text-xs text-primary hover:underline font-medium flex items-center gap-1 mx-auto cursor-pointer disabled:opacity-50 mb-6"
      >
        {resending ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : (
          <RefreshCw className="w-3 h-3" />
        )}
        reenviar o e-mail de confirmação
      </button>

      <Button asChild className="w-full">
        <Link href="/login">
          Ir para o login
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}

export function SignupForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Senhas não conferem", description: "Verifique os campos de senha." });
      return;
    }

    if (password.length < 6) {
      toast({ variant: "destructive", title: "Senha muito curta", description: "A senha deve ter no mínimo 6 caracteres." });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${siteUrl}/auth/callback` },
    });

    if (error) {
      toast({ variant: "destructive", title: "Erro ao cadastrar", description: error.message });
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return <EmailConfirmationScreen email={email} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Finanças ON</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Comece a controlar suas finanças hoje
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </div>
  );
}
