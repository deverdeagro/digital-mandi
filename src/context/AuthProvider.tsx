import { useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import type { Role, User } from "../types";

const storageKey = "digital-mandi-user";
const roleNames: Record<Role, string> = {
  farmer: "Ramesh Teron",
  spoke: "Mina Engti",
  hub: "Biren Kro",
  buyer: "Ananya Das",
};
const roles: Role[] = ["farmer", "spoke", "hub", "buyer"];

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem(storageKey);
  if (!storedUser) return null;

  try {
    const parsed: unknown = JSON.parse(storedUser);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      typeof parsed.id === "string" &&
      "name" in parsed &&
      typeof parsed.name === "string" &&
      "role" in parsed &&
      typeof parsed.role === "string" &&
      roles.includes(parsed.role as Role)
    ) {
      return { id: parsed.id, name: parsed.name, role: parsed.role as Role };
    }
  } catch (error) {
    console.error("Could not read the saved Digital Mandi session.", error);
  }

  localStorage.removeItem(storageKey);
  return null;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login(role, userId) {
      const nextUser = { id: userId, name: roleNames[role], role };
      localStorage.setItem(storageKey, JSON.stringify(nextUser));
      setUser(nextUser);
    },
    logout() {
      localStorage.removeItem(storageKey);
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
