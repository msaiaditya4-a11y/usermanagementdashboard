import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { useUsers, userStore, type User } from "@/lib/user-store";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { requireAdmin } from "@/lib/auth";

export const Route = createFileRoute("/users/")({
  beforeLoad: ({ location }) => requireAdmin(location.href),
  head: () => ({
    meta: [
      { title: "Users — Nimbus Admin" },
      { name: "description", content: "Search, filter, and manage user accounts." },
    ],
  }),
  component: UsersListPage,
});

const PAGE_SIZE = 8;

function UsersListPage() {
  const users = useUsers();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | "Admin" | "User">("all");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchRole = role === "all" || u.role === role;
      const matchQ =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchRole && matchQ;
    });
  }, [users, query, role]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const confirmDelete = () => {
    if (!toDelete) return;
    userStore.remove(toDelete.id);
    toast.success(`${toDelete.name} deleted`);
    setToDelete(null);
  };

  return (
    <AdminLayout title="User Management">
      <div className="glass-card rounded-2xl p-4 shadow-soft sm:p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name or email…"
                className="h-11 rounded-xl pl-10"
              />
            </div>
            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v as typeof role);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button asChild className="h-11 rounded-xl bg-emerald text-emerald-foreground hover:brightness-110">
            <Link to="/users/add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add user
            </Link>
          </Button>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-muted">
                        <UsersIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-base font-semibold">No users found</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-t border-border transition hover:bg-muted/40 ${
                      i % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{u.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={u.avatar} alt={u.name} />
                          <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 font-medium">{u.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          u.role === "Admin"
                            ? "rounded-full bg-teal/10 text-teal hover:bg-teal/10"
                            : "rounded-full bg-muted text-foreground hover:bg-muted"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.status === "Active"
                            ? "bg-emerald/10 text-emerald"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === "Active" ? "bg-emerald" : "bg-muted-foreground"
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="rounded-lg hover:bg-teal/10 hover:text-teal"
                        >
                          <Link to="/users/edit/$id" params={{ id: String(u.id) }}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          onClick={() => setToDelete(u)}
                          variant="ghost"
                          size="icon"
                          className="rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–
              {Math.min(pageSafe * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              return (
                <Button
                  key={n}
                  variant={n === pageSafe ? "default" : "outline"}
                  className={`h-9 w-9 rounded-lg p-0 ${
                    n === pageSafe ? "bg-teal hover:bg-teal/90" : ""
                  }`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this user account and
              remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
