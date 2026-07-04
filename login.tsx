import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { auth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nimbus Admin" },
      { name: "description", content: "Sign in to the Nimbus user management dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@nimbus.io");
  const [role, setRole] = useState<Role>("Admin");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const name = role === "Admin" ? "Alex Doe" : "Jamie Rivers";
      auth.login({
        name,
        email,
        role,
        avatar:
          role === "Admin"
            ? "https://i.pravatar.cc/120?img=8"
            : "https://i.pravatar.cc/120?img=32",
      });
      setLoading(false);
      toast.success(`Welcome back, ${name}!`);
      router.navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-teal hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nimbus.io"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••"
              defaultValue="admin1234"
              className="h-11 rounded-xl pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Demo role selector */}
        <div className="space-y-2">
          <Label>Sign in as (demo)</Label>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-1">
            {(["Admin", "User"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setEmail(r === "Admin" ? "admin@nimbus.io" : "user@nimbus.io");
                }}
                className={`h-9 rounded-lg text-sm font-medium transition ${
                  role === r
                    ? "bg-background text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Only <span className="font-semibold text-teal">Admins</span> can manage users.
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <a href="#" className="font-medium text-teal hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-emerald text-emerald-foreground shadow-glow transition hover:brightness-110"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
