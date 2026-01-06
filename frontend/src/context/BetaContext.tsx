import { createContext } from "react";
export type BetaContextType = {
  isBeta: boolean,
};

const BetaContex = createContext<BetaContextType | null>(null);
export default BetaContex;
