import React from "react";
import { useNavigate } from "react-router";
import { useCallback } from "react";

function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback((err) => {
      const errorMessage = err && typeof err === "string" ? err : "You have been logged out";

      localStorage.removeItem("accessToken");
      navigate("/login", { state: { errorMessage } });
  }, [navigate]);

  return logout;
}

export default useLogout;
