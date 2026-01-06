import { useContext } from "react";
import BetaContex from "../context/BetaContext";
import { throwError } from "../utils/throwError";
import { BetaContextType } from "../context/BetaContext";

export default function useBeta(): BetaContextType {
  const beta = useContext(BetaContex);
  if (beta == undefined) throwError("AuthContext not available", null);
  return beta;
}
