import { lazy, Suspense, type JSX } from "react";
import ErrorPage from "../app/404";
import { Providers } from "../contexts";
import { ProtectedRoute } from "../components/layout/protectedRoute";
import { RoleProtectedRoute } from "../components/layout/protectedRoute/RoleProtectedRoute";
import SignIn from "../app/SignIn";
import { createBrowserRouter, Navigate } from "react-router-dom";

const Home = lazy(() => import("@/app/(auth)/Home"));
const Dashboard = lazy(() => import("@/app/(auth)/Dashboard"));
const Devices = lazy(() => import("@/app/(auth)/Devices"));
const Playlists = lazy(() => import("@/app/(auth)/Playlists"));
const OverlayBars = lazy(() => import("@/app/(auth)/OverlayBars"));
const MediasPage = lazy(() => import("@/app/(auth)/Medias"));
const Schedules = lazy(() => import("@/app/(auth)/Schedules"));
const PlaylistDetails = lazy(() => import("@/app/(auth)/Playlists/details"));
const PlaylistCompositionGuide = lazy(() => import("@/app/(auth)/Playlists/guide"));
const Users = lazy(() => import("@/app/(auth)/Users"));
const AuditLogs = lazy(() => import("@/app/(auth)/AuditLogs"));
const Help = lazy(() => import("@/app/(auth)/Help"));

const errorElement = <ErrorPage />;

const withProviders = (element: JSX.Element) => <Providers>{element}</Providers>;

const lazyPage = (element: JSX.Element) => (
  <Suspense
    fallback={
      <div className="flex min-h-80 items-center justify-center">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    }
  >
    {element}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withProviders(<SignIn />),
    errorElement,
  },
  {
    path: "/home",
    element: withProviders(<ProtectedRoute>{lazyPage(<Home />)}</ProtectedRoute>),
    errorElement,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: lazyPage(<Dashboard />),
        errorElement,
      },
      {
        path: "devices",
        element: lazyPage(<Devices />),
        errorElement,
      },
      {
        path: "playlists",
        element: lazyPage(<Playlists />),
        errorElement,
      },
      {
        path: "overlay-bars",
        element: lazyPage(<OverlayBars />),
        errorElement,
      },
      {
        path: "users",
        element: lazyPage(<Users />),
        errorElement,
      },
      {
        path: "audit-logs",
        element: lazyPage(
          <RoleProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
            <AuditLogs />
          </RoleProtectedRoute>,
        ),
        errorElement,
      },
      {
        path: "playlist-guide",
        element: lazyPage(<PlaylistCompositionGuide />),
        errorElement,
      },
      {
        path: "playlists/:id",
        element: lazyPage(<PlaylistDetails />),
        errorElement,
      },
      {
        path: "medias",
        element: lazyPage(<MediasPage />),
        errorElement,
      },
      {
        path: "schedules",
        element: lazyPage(<Schedules />),
        errorElement,
      },
      {
        path: "help",
        element: lazyPage(<Help />),
        errorElement,
      },
    ],
  },
]);
