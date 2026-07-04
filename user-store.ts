import { useSyncExternalStore } from "react";

export type Role = "Admin" | "User";
export type Status = "Active" | "Inactive";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string; // ISO
  avatar?: string; // data URL or url
}

const KEY = "nimbus_users_v1";

const AVATARS = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=15",
  "https://i.pravatar.cc/120?img=22",
  "https://i.pravatar.cc/120?img=32",
  "https://i.pravatar.cc/120?img=45",
  "https://i.pravatar.cc/120?img=47",
  "https://i.pravatar.cc/120?img=51",
  "https://i.pravatar.cc/120?img=58",
  "https://i.pravatar.cc/120?img=61",
  "https://i.pravatar.cc/120?img=67",
];

function seed(): User[] {
  const names = [
    "Ava Thompson", "Liam Carter", "Sophia Nguyen", "Noah Patel", "Mia Robinson",
    "Ethan Walker", "Isabella Kim", "Lucas Martin", "Charlotte Reed", "Mateo Silva",
    "Amelia Brooks", "Elijah Young", "Harper Lopez", "James O'Neil", "Evelyn Chen",
    "Benjamin Rossi", "Aria Johansson", "Henry Adler", "Zoe Fernandez", "Daniel Park",
  ];
  const now = Date.now();
  return names.map((n, i) => ({
    id: i + 1,
    name: n,
    email: n.toLowerCase().replace(/[^a-z]+/g, ".") + "@nimbus.io",
    role: i % 5 === 0 ? "Admin" : "User",
    status: i % 7 === 3 ? "Inactive" : "Active",
    createdAt: new Date(now - i * 86400000 * 2 - Math.random() * 5e8).toISOString(),
    avatar: AVATARS[i % AVATARS.length],
  }));
}

let state: User[] = [];
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = JSON.parse(raw);
      return;
    }
  } catch {
    // ignore
  }
  state = seed();
  persist();
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") load();

export const userStore = {
  getAll(): User[] {
    return state;
  },
  get(id: number) {
    return state.find((u) => u.id === id);
  },
  add(u: Omit<User, "id" | "createdAt"> & { createdAt?: string }) {
    const id = (state.reduce((m, x) => Math.max(m, x.id), 0) || 0) + 1;
    const nu: User = { ...u, id, createdAt: u.createdAt ?? new Date().toISOString() };
    state = [nu, ...state];
    persist();
    emit();
    return nu;
  },
  update(id: number, patch: Partial<User>) {
    state = state.map((u) => (u.id === id ? { ...u, ...patch } : u));
    persist();
    emit();
  },
  remove(id: number) {
    state = state.filter((u) => u.id !== id);
    persist();
    emit();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useUsers() {
  return useSyncExternalStore(
    (cb) => userStore.subscribe(cb),
    () => userStore.getAll(),
    () => [] as User[],
  );
}
