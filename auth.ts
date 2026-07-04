import { redirect } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";

export type Role = "Admin" | "User";

export interface Session {
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

const KEY = "nimbus_session_v1";

let session: Session | null = null;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    session = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    session = null;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  if (session) localStorage.setItem(KEY, JSON.stringify(session));
  else localStorage.removeItem(KEY);
}

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") load();

export const auth = {
  get(): Session | null {
    return session;
  },
  login(s: Session) {
    session = s;
    persist();
    emit();
  },
  logout() {
    session = null;
    persist();
    emit();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  isAuthenticated() {
    return !!session;
  },
  hasRole(role: Role) {
    return session?.role === role;
  },
};

export function useSession(): Session | null {
  return useSyncExternalStore(
    (cb) => auth.subscribe(cb),
    () => auth.get(),
    () => null,
  );
}

/**
 * Guard helpers for use inside route `beforeLoad`.
 * Auth is client-only (localStorage) in this project, so we skip the check
 * during SSR/prerender and let it re-run on the client.
 */
export function requireAuth(href: string) {
  if (typeof window === "undefined") return;
  if (!auth.isAuthenticated()) {
    throw redirect({ to: "/login", search: { redirect: href } });
  }
}

export function requireAdmin(href: string) {
  if (typeof window === "undefined") return;
  if (!auth.isAuthenticated()) {
    throw redirect({ to: "/login", search: { redirect: href } });
  }
  if (!auth.hasRole("Admin")) {
    throw redirect({ to: "/unauthorized" });
  }
}
