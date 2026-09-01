import { useEffect, useState, type ElementType } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image,
  LayoutDashboard,
  ListVideo,
  LogOut,
  CircleHelp,
  MonitorSmartphone,
  PanelsTopLeft,
  ShieldCheck,
  ScrollText,
  UserRoundCog,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import type { UserRole } from "../../../contexts/auth-context";
import { useAuth } from "../../../contexts/useAuth";
import indoorPlayerLogo from "../../../assets/images/monitor-tijuca.png";

interface MenuItem {
  title: string;
  description: string;
  icon: ElementType;
  url: string;
  tourId: string;
  allowedRoles?: UserRole[];
}

interface AppSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  tourActive?: boolean;
  activeTourTarget?: string | null;
}

const menuItems: MenuItem[] = [
  {
    title: "Visão geral",
    description: "Resumo da operação",
    icon: LayoutDashboard,
    url: "/home/dashboard",
    tourId: "dashboard",
  },
  {
    title: "Dispositivos",
    description: "Players e operação ao vivo",
    icon: MonitorSmartphone,
    url: "/home/devices",
    tourId: "devices",
  },
  {
    title: "Mídias",
    description: "Acervo institucional",
    icon: Image,
    url: "/home/medias",
    tourId: "medias",
  },
  {
    title: "Playlists",
    description: "Sequências de conteúdo",
    icon: ListVideo,
    url: "/home/playlists",
    tourId: "playlists",
  },
  {
    title: "Barras fixas",
    description: "Faixas, imagens e logos",
    icon: PanelsTopLeft,
    url: "/home/overlay-bars",
    tourId: "overlay-bars",
  },
  {
    title: "Agendamentos",
    description: "Grade de exibição",
    icon: CalendarDays,
    url: "/home/schedules",
    tourId: "schedules",
  },
  {
    title: "Usuários",
    description: "Acessos e permissões",
    icon: UserRoundCog,
    url: "/home/users",
    tourId: "users",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "Auditoria",
    description: "Histórico geral de atividades",
    icon: ScrollText,
    url: "/home/audit-logs",
    tourId: "audit-logs",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "Ajuda",
    description: "Manual e primeiros passos",
    icon: CircleHelp,
    url: "/home/help",
    tourId: "help",
  },
];

function getInitials(name?: string) {
  if (!name) return "--";

  const names = name.trim().split(" ").filter(Boolean);
  return (
    names.length >= 2 ? `${names[0][0]}${names[names.length - 1][0]}` : name.slice(0, 2)
  ).toUpperCase();
}

function getRoleLabel(role?: UserRole) {
  return {
    OWNER: "Proprietário",
    ADMIN: "Administrador",
    OPERATOR: "Operador",
  }[role ?? "OPERATOR"];
}

export function AppSidebar({
  mobileOpen,
  onMobileClose,
  tourActive = false,
  activeTourTarget = null,
}: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    if (tourActive) setIsExpanded(true);
  }, [tourActive]);

  const visibleMenuItems = menuItems.filter(
    (item) => !item.allowedRoles || (user?.role && item.allowedRoles.includes(user.role)),
  );

  return (
    <aside
      aria-label="Navegação principal"
      className={`fixed inset-y-0 left-0 flex w-[17rem] shrink-0 flex-col border-r border-white/10 bg-[#071426] text-white shadow-2xl transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 lg:shadow-none ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${isExpanded ? "lg:w-[17rem]" : "lg:w-[5.25rem]"} ${
        tourActive ? "pointer-events-none z-50 lg:z-[90]" : "z-50"
      }`}
    >
      <div className="institutional-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-700/20 to-transparent" />

      <button
        type="button"
        onClick={onMobileClose}
        aria-label="Fechar menu"
        className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="absolute -right-3 top-9 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:border-blue-300 hover:text-blue-700 lg:flex"
        title={isExpanded ? "Recolher menu" : "Expandir menu"}
        aria-label={isExpanded ? "Recolher menu" : "Expandir menu"}
      >
        {isExpanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </button>

      <div className="relative flex min-h-24 items-center border-b border-white/10 px-5">
        <div className={`flex items-center gap-3 ${isExpanded ? "" : "lg:mx-auto"}`}>
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <img
              src={indoorPlayerLogo}
              alt="Logo Indoor Player"
              className="h-12 w-12 rounded-xl object-contain "
            />
          </div>

          <div className={`min-w-0 ${isExpanded ? "lg:block" : "lg:hidden"}`}>
            <h1 className="truncate text-lg font-bold tracking-tight text-white">Indoor Player</h1>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 py-6">
        <div
          className={`mb-4 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ${
            isExpanded ? "lg:flex" : "lg:hidden"
          }`}
        >
          <ShieldCheck size={13} />
          Gestão operacional
        </div>

        <nav className="flex flex-col gap-1.5">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.url}
                to={item.url}
                data-help-tour={item.tourId}
                onClick={onMobileClose}
                title={!isExpanded ? item.title : undefined}
                className={({ isActive }) => {
                  const isTourTarget = activeTourTarget === item.tourId;

                  return `group relative flex min-h-12 items-center rounded-xl transition duration-200 ${
                    isExpanded ? "gap-3 px-3" : "lg:justify-center lg:px-0"
                  } ${
                    isTourTarget
                      ? "bg-blue-600 text-white shadow-[0_0_0_4px_rgba(34,211,238,0.35)] ring-1 ring-cyan-200"
                      : isActive
                        ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`;
                }}
              >
                {({ isActive }) => {
                  const isTourTarget = activeTourTarget === item.tourId;

                  return (
                    <>
                      {(isActive || isTourTarget) && (
                        <span className="absolute -left-0.5 h-6 w-0.5 rounded-full bg-cyan-400" />
                      )}

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                          isActive || isTourTarget
                            ? "bg-blue-500/20 text-cyan-300"
                            : "text-slate-500 group-hover:text-blue-300"
                        }`}
                      >
                        <Icon size={19} strokeWidth={1.8} />
                      </span>

                      <span className={`min-w-0 ${isExpanded ? "lg:block" : "lg:hidden"}`}>
                        <span className="block truncate text-sm font-semibold">{item.title}</span>
                        <span
                          className={`mt-0.5 block truncate text-[10px] group-hover:text-slate-400 ${
                            isTourTarget ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </span>
                      </span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="relative border-t border-white/10 p-3">
        <div
          className={`rounded-xl border border-white/10 bg-white/[0.045] ${isExpanded ? "p-3" : "lg:p-2"}`}
        >
          <div className={`flex items-center ${isExpanded ? "gap-3" : "lg:justify-center"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white ring-1 ring-blue-400/30">
              {getInitials(user?.name)}
            </div>

            <div className={`min-w-0 flex-1 ${isExpanded ? "lg:block" : "lg:hidden"}`}>
              <span className="block truncate text-xs font-semibold text-white">
                {user?.name || "Usuário"}
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                {getRoleLabel(user?.role)}
              </span>
            </div>

            <button
              type="button"
              className={`h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 ${
                isExpanded ? "flex" : "hidden"
              }`}
              title="Encerrar sessão"
              aria-label="Encerrar sessão"
              onClick={logout}
            >
              <LogOut size={17} />
            </button>
          </div>

          {!isExpanded && (
            <button
              type="button"
              className="mt-2 hidden h-8 w-full items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-300 lg:flex"
              title="Encerrar sessão"
              aria-label="Encerrar sessão"
              onClick={logout}
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
