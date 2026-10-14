import { createContext } from "react";
import type { Role, User } from "../types";

export interface AuthContextValue {
  user: User | null;
  login: (role: Role, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
