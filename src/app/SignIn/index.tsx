import { BarChart3, CalendarClock, MonitorPlay, ShieldCheck } from "lucide-react";
import { Navigate } from "react-router-dom";

import SignInForm from "./components/SignInForm";
import { useSignIn } from "./hooks/useSignIn";
import indoorPlayerLogo from "../../assets/images/monitor-tijuca.png";

const capabilities = [
  {
    icon: MonitorPlay,
    title: "Operação centralizada",
    description: "Acompanhe todos os players e o conteúdo em exibição.",
  },
  {
    icon: CalendarClock,
    title: "Programação confiável",
    description: "Organize campanhas por dispositivo, data e prioridade.",
  },
  {
    icon: BarChart3,
    title: "Visibilidade operacional",
    description: "Tenha uma visão clara do ambiente de comunicação.",
  },
];

const SignIn = () => {
  const { isAuthenticated } = useSignIn();

  if (isAuthenticated) {
    return <Navigate to="/home/devices" replace />;
  }

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[1.08fr_0.92fr]">
      <section className="institutional-grid relative hidden overflow-hidden bg-[#071426] px-10 py-12 text-white lg:flex lg:flex-col xl:px-16 xl:py-14">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-8 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl">
            <img
              src={indoorPlayerLogo}
              alt="Logo Indoor Player"
              className="h-12 w-12 rounded-xl object-contain shadow-xl shadow-blue-950/30"
            />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">Indoor Player</p>
          </div>
        </div>

        <div className="relative my-auto max-w-2xl py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200">
            <ShieldCheck size={14} />
            Gestão corporativa de telas
          </div>

          <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-0.04em] text-white xl:text-5xl">
            Comunicação visual sob controle, em um só lugar.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Uma plataforma segura para administrar conteúdos, programações e dispositivos de
            comunicação da sua empresa.
          </p>

          <div className="mt-10 grid max-w-xl gap-3">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-cyan-300">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} Indoor Player. Ambiente corporativo de acesso restrito.
        </p>
      </section>

      <section className="relative flex min-h-dvh items-center justify-center bg-[#f7f9fc] px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-blue-500 to-cyan-400 lg:hidden" />

        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
              <MonitorPlay size={23} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-bold text-slate-950">Indoor Player</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Digital Signage
              </p>
            </div>
          </div>

          <SignInForm />
        </div>
      </section>
    </main>
  );
};

export default SignIn;
