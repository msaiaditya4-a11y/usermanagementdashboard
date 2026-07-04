import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Nimbus Admin" },
      { name: "description", content: "Register a new Nimbus admin account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== cpw) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // New self-registrations are always regular Users.
      auth.login({ name: name || "New User", email, role: "User" });
      setLoading(false);
      toast.success("Account created — welcome to Nimbus!");
      router.navigate({ to: "/dashboard" });
    }, 800);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start managing users in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-teal hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Doe" className="h-11 rounded-xl pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pw">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pw"
              type="password"
              required
              minLength={6}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="At least 6 characters"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpw">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cpw"
              type="password"
              required
              value={cpw}
              onChange={(e) => setCpw(e.target.value)}
              placeholder="Repeat password"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-emerald text-emerald-foreground shadow-glow transition hover:brightness-110"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
