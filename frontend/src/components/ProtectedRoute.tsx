import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "./Loading";
import axios from "axios";
import config from "../config";
import AuthContext from "../context/AuthContext";
import useAdminStatus from "../hooks/useAdminStatus";
import { throwError } from "../utils/throwError";

const API_URL = config.API_URL;
const VATSIM_URL = config.VATSIM_API_URL;
const VATSIM_CLIENT_ID = config.CLIENT_ID;

type ProtectedRouteParams = {
  adminRequired?: boolean;
  children: React.ReactNode;
};

function ProtectedRoute({ adminRequired = false, children }: ProtectedRouteParams) {
  const navigate = useNavigate();
  const [loginValid, setLoginValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const isAdmin = useAdminStatus(userData);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await axios.get(`${VATSIM_URL}/api/user?client_id=${VATSIM_CLIENT_ID}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUserData = userRes.data.data;
        setUserData(fetchedUserData);

        if (fetchedUserData.oauth.token_valid === "false") {
          throwError("Token invalid", null);
        }

        const verifyRes = await axios.post(`${API_URL}/auth/verifyLogin`, fetchedUserData);
        if (!verifyRes.data.allowed && !verifyRes.data.loading) {
          throwError(verifyRes.data.message || "Not authorized", null);
        }

        setLoginValid(true);
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("accessToken");
        throwError("Error while authenticating: ", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!loading && loginValid && adminRequired && !isAdmin) {
      navigate("/");
    }
  }, [loading, loginValid, adminRequired, isAdmin, navigate]);

  if (loading) return <Loading message="Verifying login..." />;
  if (!loginValid) return null;
  if (adminRequired && !isAdmin) return null;

  return <AuthContext.Provider value={{ userData, isAdmin }}>{children}</AuthContext.Provider>;
}

export default ProtectedRoute;
