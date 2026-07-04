import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Access denied — Nimbus Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const session = useSession();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient bg-background px-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald/25 blur-3xl" />

      <div className="glass-card relative w-full max-w-md rounded-3xl p-8 text-center shadow-elegant">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {session
            ? "This area is available to administrators only. Contact an admin if you believe this is a mistake."
            : "You need to sign in with an admin account to view this page."}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
            </Link>
          </Button>
          {!session && (
            <Button asChild className="h-11 rounded-xl bg-emerald text-emerald-foreground hover:brightness-110">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
