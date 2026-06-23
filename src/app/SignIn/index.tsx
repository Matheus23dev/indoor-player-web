import { Navigate } from "react-router-dom";

import SignInForm from "./components/SignInForm";
import { useSignIn } from "./hooks/useSignIn";
import logo  from "../\../assets/images/Media player-amico.svg"

const SignIn = () => {
  const { isAuthenticated } = useSignIn();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
     <main className="w-full h-screen grid lg:grid-cols-5 bg-gray-100 rounded-4xl">
      <div className="hidden bg-cover bg-center w-full lg:flex lg:col-span-3 flex-col justify-center items-center shadow-2xl">
        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col justify-center items-center p-10">
            <div className="text-center mt-16   space-y-2 select-none">
              <h1 className="text-azul-primario xl:text-4xl md:text-[35px] font-black tracking-tighter leading-none italic uppercase">
                Gestão de TVs Corporativas
              </h1>

              <p className="text-azul-terciario text-sm md:text-base font-medium tracking-wide">
                Controle todas as telas da sua empresa á distância e com poucos cliques.
              </p>
            </div>

            <img
              className="w-110 h-auto object-contain mix-blend-multiply"
              src={logo}
              alt="Animação Tijuca"
            />
          </div>
        </div>
      </div>

      <section className="lg:col-span-2 flex justify-center items-center bg-blue-800 h-full w-full">
        <div className="w-full max-w-120 p-5">
          <SignInForm />
        </div>
      </section>
    </main>
)};

export default SignIn;
