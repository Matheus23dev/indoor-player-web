import { ArrowLeft, LayoutDashboard, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/images/monitor-tijuca.png";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f3f6fa] px-5 py-8 text-slate-950 sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-700 via-cyan-400 to-blue-700"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -right-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl"
      />

      <div className="relative w-full max-w-5xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
          aria-label="Ir para o início"
        >
          <img
            src={logo}
            alt=""
            className="h-11 w-11 rounded-xl bg-white object-contain p-1.5 shadow-sm ring-1 ring-slate-200"
          />
          <span>
            <strong className="block text-sm font-bold tracking-tight text-slate-950">
              Indoor Player
            </strong>
            <span className="block text-xs text-slate-500">Digital Signage</span>
          </span>
        </Link>

        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="institutional-grid relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#071426] p-7 text-white sm:p-10 lg:min-h-130">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl"
            />

            <div className="relative inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              <SearchX className="h-4 w-4" aria-hidden="true" />
              Erro 404
            </div>

            <div className="relative mt-12 lg:mt-0">
              <p className="text-[clamp(5rem,16vw,10rem)] font-black leading-none tracking-[-0.08em] text-white/10">
                404
              </p>
              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
                O endereço acessado não corresponde a uma página disponível no sistema.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <span className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Página não encontrada
            </span>
            <h1 className="max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Parece que esta tela saiu da programação.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Verifique se o endereço foi digitado corretamente ou retorne ao painel para continuar
              gerenciando seus players e playlists.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/home/dashboard"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Ir para o painel
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Voltar à página anterior
              </button>
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          Se o problema continuar, acesse novamente pelo menu principal.
        </p>
      </div>
    </main>
  );
};

export default ErrorPage;
