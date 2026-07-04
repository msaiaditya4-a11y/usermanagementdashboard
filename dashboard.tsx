import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { useUsers } from "@/lib/user-store";
import { Users, ShieldCheck, User as UserIcon, UserPlus, TrendingUp, Activity, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { requireAuth, useSession } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => requireAuth(location.href),
  head: () => ({
    meta: [
      { title: "Dashboard — Nimbus Admin" },
      { name: "description", content: "Overview of users, roles, and recent activity." },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "teal" | "emerald" | "navy" | "amber";
}) {
  const tones: Record<string, string> = {
    teal: "from-teal/15 to-teal/5 text-teal",
    emerald: "from-emerald/20 to-emerald/5 text-emerald",
    navy: "from-navy/15 to-navy/5 text-navy",
    amber: "from-amber-400/20 to-amber-400/5 text-amber-600",
  };
  return (
    <div className="glass-card group rounded-2xl p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
        </div>
        <div
          className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs">
        <TrendingUp className="h-3.5 w-3.5 text-emerald" />
        <span className="font-semibold text-emerald">{delta}</span>
        <span className="text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
}

function DashboardPage() {
  const users = useUsers();
  const session = useSession();
  const isAdmin = session?.role === "Admin";


  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "Admin").length;
    const regular = users.filter((u) => u.role === "User").length;
    const today = new Date().toDateString();
    const todayRegs = users.filter((u) => new Date(u.createdAt).toDateString() === today).length;
    return { total, admins, regular, todayRegs };
  }, [users]);

  const areaData = useMemo(() => {
    const days = 14;
    const now = new Date();
    return Array.from({ length: days }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (days - 1 - i));
      const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const count = users.filter(
        (u) => new Date(u.createdAt).toDateString() === d.toDateString(),
      ).length;
      return { label, registrations: count || Math.floor(Math.random() * 6) + 1 };
    });
  }, [users]);

  const barData = useMemo(
    () => [
      { role: "Admin", count: stats.admins },
      { role: "User", count: stats.regular },
      { role: "Inactive", count: users.filter((u) => u.status === "Inactive").length },
    ],
    [users, stats],
  );

  const recent = [...users]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return (
    <AdminLayout>
      {/* Welcome */}
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-brand-gradient p-6 text-white shadow-elegant sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.2em] text-white/70">Welcome back</div>
          <h2 className="mt-1 truncate text-2xl font-bold sm:text-3xl">
            Hello, {session?.name?.split(" ")[0] ?? "there"} 👋
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            {isAdmin
              ? "Here's what's happening across your organization today."
              : "Here's a snapshot of your account and recent activity."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Button asChild className="rounded-xl bg-white text-teal hover:bg-white/90">
              <Link to="/users/add">
                <UserPlus className="mr-2 h-4 w-4" />
                Add user
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.total} delta="+12%" icon={Users} tone="teal" />
        <StatCard label="Admins" value={stats.admins} delta="+3%" icon={ShieldCheck} tone="emerald" />
        <StatCard
          label="Regular Users"
          value={stats.regular}
          delta="+8%"
          icon={UserIcon}
          tone="navy"
        />
        <StatCard
          label="Today's Registrations"
          value={stats.todayRegs}
          delta="+2"
          icon={Activity}
          tone="amber"
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Registrations</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <Badge className="rounded-full bg-emerald/10 text-emerald hover:bg-emerald/10">Live</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-emerald)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-emerald)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} />
                <RTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="var(--color-teal)"
                  strokeWidth={2.5}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-soft">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Users by role</h3>
            <p className="text-xs text-muted-foreground">Distribution snapshot</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="role" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} width={28} />
                <RTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Bar dataKey="count" fill="var(--color-teal)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent + actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Recent users</h3>
              <p className="text-xs text-muted-foreground">Most recently added accounts</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <Link to="/users">View all</Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-3">User</th>
                  <th className="pb-3 pr-3">Role</th>
                  <th className="pb-3 pr-3">Joined</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-t border-border transition hover:bg-muted/50 ${
                      i % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={u.avatar} alt={u.name} />
                          <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{u.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
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
                    <td className="py-3 pr-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-soft">
          <h3 className="text-base font-semibold">Quick actions</h3>
          <p className="text-xs text-muted-foreground">Common tasks</p>
          <div className="mt-4 grid gap-2">
            {isAdmin && (
              <Button asChild className="h-11 justify-start rounded-xl bg-teal hover:bg-teal/90">
                <Link to="/users/add">
                  <UserPlus className="mr-2 h-4 w-4" /> Add new user
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button asChild variant="outline" className="h-11 justify-start rounded-xl">
                <Link to="/users">
                  <Users className="mr-2 h-4 w-4" /> Manage users
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="h-11 justify-start rounded-xl"
            >
              <Link to="/profile">
                <UserIcon className="mr-2 h-4 w-4" /> Edit my profile
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 justify-start rounded-xl"
            >
              <Link to="/settings">
                <ShieldCheck className="mr-2 h-4 w-4" /> Security settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
