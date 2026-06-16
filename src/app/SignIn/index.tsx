import { Navigate } from "react-router-dom";

import SignInForm from "./components/SignInForm";
import { useSignIn } from "./hooks/useSignIn";

const SignIn = () => {
  const { isAuthenticated } = useSignIn();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <main className="w-full h-screen grid xl:grid-cols-2 bg-azulTerciario">
      <div className="hidden bg-[var(--amarelo)] w-full rounded-r-2xl xl:flex flex-col justify-center items-center">
        <div className="flex flex-col gap-2 ">
          {/* <img className="w-35 md:w-50 flex m-auto" src={Logo} alt="Logo Tijuca" /> */}
          <h1 className="text-center text-white text-4xl md:text-5xl font-bold">Tijuca Track</h1>
        </div>
        {/* <img src={animation} alt="animation SignIn" /> */}
      </div>

      <section className="flex md:gap-20 pt-20 justify-center bg-(--azul-terciario) h-full w-full p-2">
        <SignInForm />
      </section>
    </main>
  );
};

export default SignIn;
