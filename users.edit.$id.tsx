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
import { useEffect, useState } from "react";
import { userStore, type Role, type Status } from "@/lib/user-store";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export const Route = createFileRoute("/users/edit/$id")({
  beforeLoad: ({ location }) => requireAdmin(location.href),
  head: () => ({
    meta: [{ title: "Edit user — Nimbus Admin" }],
  }),
  component: EditUserPage,
  notFoundComponent: () => (
    <AdminLayout title="User not found">
      <p className="text-muted-foreground">
        We couldn't find that user.{" "}
        <Link to="/users" className="text-teal hover:underline">
          Back to users
        </Link>
      </p>
    </AdminLayout>
  ),
});

function EditUserPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const user = userStore.get(Number(id));

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "User");
  const [status, setStatus] = useState<Status>(user?.status ?? "Active");
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setAvatar(user.avatar);
  }, [user]);

  if (!user) {
    return (
      <AdminLayout title="User not found">
        <p className="text-muted-foreground">
          We couldn't find that user.{" "}
          <Link to="/users" className="text-teal hover:underline">
            Back to users
          </Link>
        </p>
      </AdminLayout>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      userStore.update(user.id, { name, email, role, status, avatar });
      toast.success("User updated");
      router.navigate({ to: "/users" });
    }, 500);
  };

  return (
    <AdminLayout title={`Edit ${user.name}`}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -mt-2 rounded-lg">
        <Link to="/users">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to users
        </Link>
      </Button>

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 shadow-soft lg:col-span-2">
          <h3 className="text-base font-semibold">Account details</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button asChild type="button" variant="outline" className="h-11 rounded-xl">
              <Link to="/users">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-teal text-white hover:bg-teal/90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update user"}
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-base font-semibold">Profile image</h3>
          <p className="text-sm text-muted-foreground">Change the user's avatar.</p>
          <div className="mt-4">
            <ImageUpload value={avatar} onChange={setAvatar} />
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
