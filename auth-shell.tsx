import { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-gradient bg-background">
      {/* Abstract shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-navy/10 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link
              to="/login"
              className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow"
            >
              <ShieldCheck className="h-7 w-7" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-navy">Nimbus</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              User Management
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-elegant sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
