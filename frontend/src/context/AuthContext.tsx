import { createContext } from "react";
import { VatsimUser } from "../types/users";

export type AuthContextType = {
  userData: VatsimUser | null
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;
