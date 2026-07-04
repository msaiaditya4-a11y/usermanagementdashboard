import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2, Calendar, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ location }) => requireAuth(location.href),
  head: () => ({ meta: [{ title: "Profile — Nimbus Admin" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [avatar, setAvatar] = useState<string | undefined>("https://i.pravatar.cc/240?img=8");
  const [name, setName] = useState("Alex Doe");
  const [email, setEmail] = useState("alex@nimbus.io");
  const [phone, setPhone] = useState("+1 (415) 555-0119");
  const [bio, setBio] = useState("Product-minded administrator running the Nimbus platform.");
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState("");
  const [npw, setNpw] = useState("");
  const [cpw, setCpw] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully");
    }, 500);
  };

  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (npw !== cpw) return toast.error("New passwords do not match");
    if (npw.length < 6) return toast.error("New password must be at least 6 characters");
    setChangingPw(true);
    setTimeout(() => {
      setChangingPw(false);
      setPw("");
      setNpw("");
      setCpw("");
      toast.success("Password changed");
    }, 500);
  };

  return (
    <AdminLayout title="My Profile">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <div className="glass-card flex flex-col items-center rounded-2xl p-6 text-center shadow-soft">
          <div className="relative">
            <Avatar className="h-32 w-32 ring-4 ring-teal/20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-2xl">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-1 -right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-emerald text-emerald-foreground shadow-glow transition hover:brightness-110">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
          </div>
          <h3 className="mt-4 text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">Administrator</p>
          <div className="mt-4 flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-xl"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            >
              <Camera className="mr-2 h-4 w-4" /> Upload
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setAvatar(undefined)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>

          <div className="mt-6 w-full space-y-3 border-t border-border pt-6 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account information
            </div>
            <Info icon={Mail} label="Email" value={email} />
            <Info icon={ShieldCheck} label="Role" value="Administrator" />
            <Info icon={Calendar} label="Joined" value="Jan 12, 2024" />
          </div>
        </div>

        {/* Update profile */}
        <form
          onSubmit={saveProfile}
          className="glass-card rounded-2xl p-6 shadow-soft lg:col-span-2"
        >
          <h3 className="text-base font-semibold">Personal information</h3>
          <p className="text-sm text-muted-foreground">Update your public profile details.</p>
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
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input defaultValue="America/Los_Angeles" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Bio</Label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-teal text-white hover:bg-teal/90"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
            </Button>
          </div>
        </form>

        {/* Change password */}
        <form onSubmit={changePw} className="glass-card rounded-2xl p-6 shadow-soft lg:col-span-3">
          <h3 className="text-base font-semibold">Change password</h3>
          <p className="text-sm text-muted-foreground">Use a strong password you don't reuse elsewhere.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" value={npw} onChange={(e) => setNpw(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Confirm new password</Label>
              <Input type="password" value={cpw} onChange={(e) => setCpw(e.target.value)} className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={changingPw}
              className="h-11 rounded-xl bg-emerald text-emerald-foreground shadow-glow hover:brightness-110"
            >
              {changingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
