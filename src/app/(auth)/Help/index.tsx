import { useMemo, useState, type ElementType } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CircleHelp,
  Clock3,
  Image,
  LayoutDashboard,
  Lightbulb,
  ListVideo,
  MonitorSmartphone,
  PanelsTopLeft,
  PlayCircle,
  Route,
  ScrollText,
  Search,
  UserRoundCog,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageContainer, PageHeader, PageScrollArea } from "../../../components/layout/Page";
import { useAuth } from "../../../contexts/useAuth";
import { getVisibleHelpModules, helpQuestions, workflowSteps, type HelpModuleId } from "./content";
import { useHelpTour } from "./useHelpTour";

const moduleIcons: Record<HelpModuleId, ElementType> = {
  dashboard: LayoutDashboard,
  devices: MonitorSmartphone,
  medias: Image,
  playlists: ListVideo,
  "overlay-bars": PanelsTopLeft,
  schedules: CalendarDays,
  users: UserRoundCog,
  "audit-logs": ScrollText,
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export default function Help() {
  const { user } = useAuth();
  const { startTour } = useHelpTour();
  const [search, setSearch] = useState("");

  const visibleModules = useMemo(() => getVisibleHelpModules(user?.role), [user?.role]);
  const normalizedSearch = normalizeSearch(search);

  const filteredModules = useMemo(() => {
    if (!normalizedSearch) return visibleModules;

    return visibleModules.filter((module) =>
      normalizeSearch(
        [
          module.title,
          module.eyebrow,
          module.description,
          module.actions.join(" "),
          module.tip,
        ].join(" "),
      ).includes(normalizedSearch),
    );
  }, [normalizedSearch, visibleModules]);

  const filteredQuestions = useMemo(() => {
    if (!normalizedSearch) return helpQuestions;

    return helpQuestions.filter((item) =>
      normalizeSearch(`${item.question} ${item.answer} ${item.keywords}`).includes(
        normalizedSearch,
      ),
    );
  }, [normalizedSearch]);

  const hasResults = filteredModules.length > 0 || filteredQuestions.length > 0;

  return (
    <PageContainer width="wide" scrollable>
      <PageHeader
        tourId="help-summary"
        eyebrow="Central de ajuda"
        title="Como usar o Indoor Player"
        description="Consulte o fluxo recomendado, entenda cada módulo e encontre respostas rápidas sem sair do sistema."
        icon={CircleHelp}
        actions={
          <button
            type="button"
            onClick={startTour}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <PlayCircle size={17} aria-hidden="true" />
            Refazer apresentação
          </button>
        }
      />

      <PageScrollArea ariaLabel="Conteúdo da central de ajuda" className="space-y-5 pb-6">
        <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:grid-cols-[0.75fr_1.25fr]">
          <div className="institutional-grid relative overflow-hidden bg-[#071426] p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-500/25 blur-3xl" />
            <Route className="relative h-8 w-8 text-cyan-300" aria-hidden="true" />
            <p className="relative mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Primeiros passos
            </p>
            <h2 className="relative mt-2 max-w-sm text-2xl font-bold tracking-tight">
              Do arquivo até a tela em seis etapas
            </h2>
            <p className="relative mt-3 max-w-md text-sm leading-6 text-slate-300">
              Siga esta ordem para publicar com segurança e facilitar futuras alterações na
              programação.
            </p>
          </div>

          <ol className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
            {workflowSteps.map((step) => (
              <li key={step.number} className="bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>
                    <Link
                      to={step.url}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                      Abrir função
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          data-help-tour="help-search-area"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5"
        >
          <label htmlFor="help-search" className="text-sm font-bold text-slate-900">
            O que você precisa encontrar?
          </label>
          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
              aria-hidden="true"
            />
            <input
              id="help-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquise por playlist, Player, áudio, barra, logs..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
            />
          </div>
        </section>

        {!hasResults && (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <CircleHelp className="mx-auto text-slate-300" size={34} aria-hidden="true" />
            <h2 className="mt-3 text-base font-bold text-slate-900">Nenhum resultado encontrado</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tente pesquisar com menos palavras ou por outro nome da função.
            </p>
          </section>
        )}

        {filteredModules.length > 0 && (
          <section data-help-tour="help-manual" aria-labelledby="help-modules-title">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                  Manual por módulo
                </p>
                <h2 id="help-modules-title" className="mt-1 text-xl font-bold text-slate-950">
                  O que cada função faz
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {filteredModules.length} {filteredModules.length === 1 ? "módulo" : "módulos"}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredModules.map((module) => {
                const Icon = moduleIcons[module.id];

                return (
                  <article
                    key={module.id}
                    className="flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
                          {module.eyebrow}
                        </p>
                        <h3 className="mt-0.5 text-lg font-bold text-slate-950">{module.title}</h3>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">{module.description}</p>

                    <ul className="mt-4 space-y-2">
                      {module.actions.map((action) => (
                        <li key={action} className="flex items-start gap-2 text-sm text-slate-600">
                          <BookOpenCheck
                            className="mt-0.5 shrink-0 text-emerald-600"
                            size={15}
                            aria-hidden="true"
                          />
                          {action}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900 ring-1 ring-amber-100">
                      <Lightbulb className="mt-0.5 shrink-0" size={14} aria-hidden="true" />
                      {module.tip}
                    </div>

                    <Link
                      to={module.url}
                      className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                      Ir para {module.title}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {filteredQuestions.length > 0 && (
          <section aria-labelledby="help-faq-title">
            <div className="mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                Respostas rápidas
              </p>
              <h2 id="help-faq-title" className="mt-1 text-xl font-bold text-slate-950">
                Dúvidas frequentes
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              {filteredQuestions.map((item, index) => (
                <details
                  key={item.question}
                  className={`group p-5 open:bg-slate-50 ${
                    index > 0 ? "border-t border-slate-200" : ""
                  }`}
                >
                  <summary className="flex list-none items-center justify-between gap-4 text-sm font-bold text-slate-900 marker:hidden">
                    <span>{item.question}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-45 group-open:bg-blue-100 group-open:text-blue-700">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-4xl pr-10 text-sm leading-6 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-blue-100">
              <Clock3 size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-blue-950">
                Precisa rever o sistema passo a passo?
              </h2>
              <p className="mt-1 text-xs leading-5 text-blue-800">
                A apresentação pode ser executada novamente sem alterar nenhuma configuração.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={startTour}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100"
          >
            <PlayCircle size={16} aria-hidden="true" />
            Iniciar apresentação
          </button>
        </section>
      </PageScrollArea>
    </PageContainer>
  );
}
