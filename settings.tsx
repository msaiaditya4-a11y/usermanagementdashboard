import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Moon, Bell, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ location }) => requireAuth(location.href),
  head: () => ({ meta: [{ title: "Settings — Nimbus Admin" }] }),
  component: SettingsPage,
});

function Row({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 sm:flex sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div className="flex shrink-0 items-center">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [twoFa, setTwoFa] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AdminLayout title="Settings">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 shadow-soft lg:col-span-2">
          <h3 className="text-base font-semibold">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize how Nimbus looks on your device.</p>
          <Separator className="my-4" />
          <Row icon={Moon} title="Dark mode" desc="Toggle between light and dark themes.">
            <Switch checked={dark} onCheckedChange={setDark} />
          </Row>

          <div className="mt-6">
            <h3 className="text-base font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">Choose what updates you want to receive.</p>
          </div>
          <Separator className="my-4" />
          <Row icon={Bell} title="Email notifications" desc="Account activity and alerts by email.">
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </Row>
          <Separator />
          <Row icon={Bell} title="Push notifications" desc="Real-time alerts inside the dashboard.">
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </Row>
          <Separator />
          <Row icon={Bell} title="Product news" desc="Occasional updates about new features.">
            <Switch checked={marketing} onCheckedChange={setMarketing} />
          </Row>

          <div className="mt-6">
            <h3 className="text-base font-semibold">Security</h3>
            <p className="text-sm text-muted-foreground">Protect your account with an extra layer of security.</p>
          </div>
          <Separator className="my-4" />
          <Row icon={ShieldCheck} title="Two-factor authentication" desc="Require a code at sign-in.">
            <Switch checked={twoFa} onCheckedChange={setTwoFa} />
          </Row>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Password updated");
            }}
            className="glass-card rounded-2xl p-6 shadow-soft"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Change password</h3>
                <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Current</Label>
                <Input type="password" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>New</Label>
                <Input type="password" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm</Label>
                <Input type="password" className="h-11 rounded-xl" />
              </div>
              <Button type="submit" className="h-11 w-full rounded-xl bg-teal hover:bg-teal/90">
                Update password
              </Button>
            </div>
          </form>

          <div className="glass-card rounded-2xl border border-destructive/30 p-6 shadow-soft">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-destructive">Delete account</h3>
                <p className="text-xs text-muted-foreground">Permanently remove your account and data.</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Delete my account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is permanent. All of your data will be erased and cannot be
                    recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast.success("Account deletion scheduled")}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
