import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LHDCPage from "./pages/LHDCPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";

import * as Sentry from "@sentry/react";
import config from "./config.ts";

if (import.meta.env.MODE == "production") {
  Sentry.init({
    dsn: config.SENTRY_DSN,
  });
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute children={<App />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute adminRequired={true} children={<AdminPage />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/lhdc",
    element: <ProtectedRoute children={<LHDCPage />} />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
