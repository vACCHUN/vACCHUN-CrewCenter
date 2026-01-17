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
import Aftn from "./AFTN/AftnMain.tsx";
import AftnLogin from "./pages/AFTNLogin.tsx";

if (import.meta.env.MODE == "development") {
  Sentry.init({
    dsn: "https://67ef4ff23bca07b89fb38f9edcacacfd@o4509085320675328.ingest.de.sentry.io/4509085322248272",
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
    path: "/aftn/login",
    element: <ProtectedRoute aftn={true} children={<AftnLogin />} />,
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
