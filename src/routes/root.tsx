import type { JSX } from "react/jsx-runtime";
import ErrorPage from "../app/404";
import { Providers } from "../contexts";
import { RenderConditional } from "../components/RenderConditional";
import { ProtectedRoute } from "../components/layout/protectedRoute";
import SignIn from "../app/SignIn";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/app/(auth)/Home";
import Devices from "@/app/(auth)/Devices";
import Playlists from "@/app/(auth)/Playlists/index";
import MediasPage from "@/app/(auth)/Medias";
import Schedules from "@/app/(auth)/Schedules";
import PlaylistDetails from "@/app/(auth)/Playlists/details";
import Users from "../app/(auth)/Users";

const errorElement = <ErrorPage />;

const withProviders = (
  element: JSX.Element,
  protectedRoute: boolean = true,
) => (
  <Providers>
    <RenderConditional condition={!protectedRoute}>{element}</RenderConditional>
    <RenderConditional condition={protectedRoute}>
      <ProtectedRoute>{element}</ProtectedRoute>
    </RenderConditional>
  </Providers>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withProviders(<SignIn />, false),
    errorElement,
  },
  {
    path: "/home",
    element: withProviders(<Home />),
    errorElement,
    children: [
      {
        path: "devices",
        element: withProviders(<Devices />),
        errorElement,
      },
      {
        path: "playlists",
        element: withProviders(<Playlists />),
        errorElement,
      },
      {
        path: "users",
        element: withProviders(<Users />),
        errorElement,
      },
     {
  path: "playlists/:id",
  element: withProviders(
    <PlaylistDetails />,
  ),
  errorElement,
},
      {
        path: "medias",
        element: withProviders(<MediasPage />),
        errorElement,
      },
      {
        path: "schedules",
        element: withProviders(<Schedules />),
        errorElement,
      },
      
    ],
  },
]);
