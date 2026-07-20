import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { useSignIn } from "../../hooks/useSignIn";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import logo  from "../../../../assets/images/monitor-play.svg"
import { useState } from "react";


const SignInForm = () => {
   const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSignIn,
  } = useSignIn();

  return (
      <Card className="flex flex-col w-full max-w-md h-auto rounded-2xl bg-white/95 backdrop-blur shadow-xl border-none">
      <CardHeader className="space-y-1">
        <div className="flex flex-col items-center">
          <img
            className="w-20 m-auto"
            src={logo}
            alt="Logo"
          />
          <div className="flex flex-col items-center select-none mb-4">
            <h1 className="text-azul-terciario text-2xl font-black tracking-tighter leading-none italic">
              Indoor Player
            </h1>
            <div className="flex items-center gap-2 w-full ">
              <div className="h-px bg-azul-terciario/30 grow"></div>
              <span className="text-azul-terciario text-[14px] font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                ADMIN
              </span>
              <div className="h-px bg-azul-terciario/30 grow"></div>
            </div>
          </div>
          <p className="text-cinza text-sm">
            Identifique-se para continuar
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-5 mt-4">
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza w-5 h-5 z-10 transition-colors group-focus-within:text-azul-primario" />
            <input
              type="email"
              id="email"
              className="peer w-full bg-white border border-cinza/30 rounded-xl px-10 pt-6 pb-2 text-preto outline-none focus:ring-2 focus:ring-azul-primario/20 focus:border-azul-primario transition-all placeholder-transparent"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <label
              htmlFor="email"
              className="absolute left-10 top-4 text-cinza transition-all duration-200
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-azul-primario
              peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              E-mail
            </label>
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza w-5 h-5 z-10 transition-colors group-focus-within:text-azul-primario" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="peer w-full bg-white border border-cinza/30 rounded-xl px-10 pt-6 pb-2 text-preto outline-none focus:ring-2 focus:ring-azul-primario/20 focus:border-azul-primario transition-all placeholder-transparent"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <label
              htmlFor="password"
              className="absolute left-10 top-4 text-cinza transition-all duration-200 
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-azul-primario
              peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Senha
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cinza hover:text-azul-primario transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={handleSignIn}
            type="submit"
            className="w-full bg-blue-700 hover:bg-blu-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg mt-2"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center">
            <a
              href="#"
              className="text-azul-primario text-xs hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
