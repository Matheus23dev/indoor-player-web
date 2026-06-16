import type { JSX } from "react/jsx-runtime";
import ErrorPage from "../app/404";
import { Providers } from "../contexts";
import { RenderConditional } from "../components/RenderConditional";
import { ProtectedRoute } from "../components/layout/protectedRoute";
import SignIn from "../app/SignIn";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/app/(auth)/Home";
import Devices from "@/app/(auth)/Devices";


const errorElement = <ErrorPage />

const withProviders = (element: JSX.Element, protectedRoute: boolean = true) => (
  <Providers>
    <RenderConditional condition={!protectedRoute}>
      {element}
    </RenderConditional>
    <RenderConditional condition={protectedRoute}>
      <ProtectedRoute>
        {element}
      </ProtectedRoute>
    </RenderConditional>
  </Providers>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withProviders(<SignIn/>, false),
    errorElement,
  },
  {
    path: "/home",
    element: withProviders(<Home/>),
    errorElement,
    children: [
      {
        path: "devices",
        element: withProviders(<Devices/>),
        errorElement
      },]
  },
  
    
  
]);
