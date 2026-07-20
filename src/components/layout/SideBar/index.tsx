import {
  useState,
} from "react";

import {
  MonitorSmartphone,
  Image,
  ListVideo,
  CalendarDays,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useAuth,
} from "../../../contexts/auth.context";

const menuItems = [
  {
    title: "Dispositivos",
    icon: MonitorSmartphone,
    url: "/home/devices",
  },

  {
    title: "Mídias",
    icon: Image,
    url: "/home/medias",
  },

  {
    title: "Playlists",
    icon: ListVideo,
    url: "/home/playlists",
  },

  {
    title: "Agendamentos",
    icon: CalendarDays,
    url: "/home/schedules",
  },
];

const getInitials = (
  name?: string,
) => {
  if (!name) {
    return "--";
  }

  const names =
    name
      .trim()
      .split(" ")
      .filter(Boolean);

  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }

  return name
    .substring(
      0,
      2,
    )
    .toUpperCase();
};

export function AppSidebar() {
  const [isExpanded, setIsExpanded] =
    useState(true);

  const {
    logout,
    user,
  } = useAuth();

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 ${
        isExpanded
          ? "w-72"
          : "w-20"
      }`}
    >
      <button
        type="button"
        onClick={() =>
          setIsExpanded(
            !isExpanded,
          )
        }
        className="absolute -right-3 top-8 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        title={
          isExpanded
            ? "Recolher menu"
            : "Expandir menu"
        }
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <div
        className={`flex min-h-24 items-center border-b border-slate-100 px-5 transition-all ${
          isExpanded
            ? "justify-start"
            : "justify-center"
        }`}
      >
        {isExpanded ? (
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm">
              IP
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold leading-tight text-slate-900">
                Indoor Player
              </h1>

              <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                Gerenciamento de TVs
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm">
            I
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5">
        <div>
          {isExpanded && (
            <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Operacional
            </p>
          )}

          <nav className="flex flex-col gap-2">
            {menuItems.map(item => (
              <a
                key={item.title}
                href={item.url}
                title={
                  !isExpanded
                    ? item.title
                    : undefined
                }
                className={`group flex items-center rounded-2xl text-sm font-semibold text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700 ${
                  isExpanded
                    ? "gap-3 px-3.5 py-3"
                    : "justify-center p-3"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all group-hover:bg-blue-100 group-hover:text-blue-700">
                  <item.icon className="h-5 w-5" />
                </div>

                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    isExpanded
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  }`}
                >
                  {item.title}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div
          className={`rounded-2xl bg-slate-50 transition-all ${
            isExpanded
              ? "p-3"
              : "p-2"
          }`}
        >
          <div
            className={`flex items-center ${
              isExpanded
                ? "justify-between gap-3"
                : "justify-center"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                {user
                  ? getInitials(
                      user.name,
                    )
                  : "--"}
              </div>

              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <span
                    className="block truncate text-sm font-bold text-slate-900"
                    title={user?.name}
                  >
                    {user?.name ||
                      "Carregando..."}
                  </span>

                  <span
                    className="mt-0.5 block truncate text-[11px] font-medium text-slate-500"
                    title={user?.email}
                  >
                    {user?.email ||
                      "Aguarde"}
                  </span>
                </div>
              )}
            </div>

            {isExpanded && (
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
                title="Sair"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}