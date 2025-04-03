import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { throwError } from "../utils/throwError";
import { AuthContextType } from "../context/AuthContext";

export default function useAuth(): AuthContextType {
  const auth = useContext(AuthContext);
  if (!auth) throwError("AuthContext not available", null);
  return auth;
}
