import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState } from "react";

import { useSignIn } from "../../hooks/useSignIn";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { email, setEmail, password, setPassword, loading, handleSignIn } = useSignIn();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
          Portal administrativo
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950">
          Acesse sua conta
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Utilize suas credenciais corporativas para continuar.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            E-mail
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="email"
              id="email"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="nome@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
            Senha
          </label>
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {loading ? <LoaderCircle size={18} className="animate-spin" /> : <LogIn size={18} />}
          {loading ? "Autenticando..." : "Entrar no painel"}
        </button>
      </form>

      <div className="mt-7 border-t border-slate-100 pt-5">
        <p className="text-center text-xs leading-5 text-slate-400">
          Acesso monitorado e restrito a usuários autorizados.
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
