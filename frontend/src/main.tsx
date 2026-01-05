import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.js";
import LoginPage from "./pages/LoginPage.js";
import AdminPage from "./pages/AdminPage.js";
import LHDCPage from "./pages/LHDCPage.js";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import FilesPage from "./pages/FilesPage.tsx";
import EventsPage from "./pages/EventsPage.tsx";

import * as Sentry from "@sentry/react";
import config from "./config.ts";
import Aftn from "./AFTN/AftnMain.tsx";

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
  {
    path: "/files",
    element: <ProtectedRoute children={<FilesPage />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/events",
    element: <ProtectedRoute children={<EventsPage />} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/aftn",
    element: <ProtectedRoute children={<Aftn />} />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
