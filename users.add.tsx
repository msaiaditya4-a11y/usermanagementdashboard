import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { useState } from "react";
import { userStore, type Role } from "@/lib/user-store";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export const Route = createFileRoute("/users/add")({
  beforeLoad: ({ location }) => requireAdmin(location.href),
  head: () => ({
    meta: [{ title: "Add user — Nimbus Admin" }],
  }),
  component: AddUserPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "User"]),
});

function AddUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [avatar, setAvatar] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse({ name, email, password, role });
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      userStore.add({ name, email, role, status: "Active", avatar });
      toast.success("User created successfully");
      router.navigate({ to: "/users" });
    }, 600);
  };

  return (
    <AdminLayout title="Add new user">
      <Button asChild variant="ghost" size="sm" className="mb-4 -mt-2 rounded-lg">
        <Link to="/users">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to users
        </Link>
      </Button>

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 shadow-soft lg:col-span-2">
          <h3 className="text-base font-semibold">Account details</h3>
          <p className="text-sm text-muted-foreground">Fill in the new user's basic info.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Role">
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button asChild type="button" variant="outline" className="h-11 rounded-xl">
              <Link to="/users">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-emerald text-emerald-foreground shadow-glow hover:brightness-110"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create user"}
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-base font-semibold">Profile image</h3>
          <p className="text-sm text-muted-foreground">Optional avatar for this user.</p>
          <div className="mt-4">
            <ImageUpload value={avatar} onChange={setAvatar} />
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
