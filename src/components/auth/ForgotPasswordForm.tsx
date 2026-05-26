"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset-password`,
      });

      // Supabase sometimes returns a JSON parse error even on success (empty 200 body).
      // Any other real error (e.g. rate limit, invalid email) has a non-JSON message.
      if (error && !error.message.toLowerCase().includes("json")) {
        setLoading(false);
        toast({ variant: "destructive", title: "Erro ao enviar e-mail", description: error.message });
        return;
      }
    } catch {
      // Unexpected throw — still show success to avoid leaking whether the email exists
    }

    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-6">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">E-mail enviado!</h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-xs">
            Enviamos um link de redefinição para
          </p>
          <p className="text-sm font-semibold text-foreground mt-1 break-all">{email}</p>
        </div>

        <div className="bg-muted rounded-xl p-4 text-left space-y-3 mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Próximos passos
          </p>
          {[
            "Abra sua caixa de entrada",
            "Clique em \"Redefinir senha\" no e-mail",
            "Crie uma nova senha",
            "Faça login com a nova senha",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{step}</span>
            </div>
          ))}
        </div>

        <Button asChild className="w-full">
          <Link href="/login">Voltar para o login</Link>
        </Button>
      </div>
    );
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
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Esqueceu a senha?</h1>
        <p className="text-muted-foreground text-sm mt-1 text-center max-w-xs">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
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

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link de redefinição"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link href="/login" className="text-primary hover:underline font-medium flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
