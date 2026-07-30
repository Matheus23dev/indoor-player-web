import {
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image,
  ListVideo,
  LogOut,
  MonitorSmartphone,
  User,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  useAuth,
} from "../../../contexts/auth.context";

type UserRole =
  | "OWNER"
  | "ADMIN"
  | "OPERATOR";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url: string;
  allowedRoles?: UserRole[];
}

const menuItems: MenuItem[] = [
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
  {
    title: "Usuários",
    icon: User,
    url: "/home/users",
    allowedRoles: [
      "OWNER",
      "ADMIN",
    ],
  },
];

function getInitials(
  name?: string,
) {
  if (!name) {
    return "--";
  }

  const names =
    name
      .trim()
      .split(" ")
      .filter(Boolean);

  if (names.length >= 2) {
    return `${names[0][0]}${
      names[
        names.length - 1
      ][0]
    }`.toUpperCase();
  }

  return name
    .substring(0, 2)
    .toUpperCase();
}

function getRoleLabel(
  role?: UserRole,
) {
  switch (role) {
    case "OWNER":
      return "Proprietário";

    case "ADMIN":
      return "Administrador";

    case "OPERATOR":
      return "Operador";

    default:
      return "Usuário";
  }
}

export function AppSidebar() {
  const [
    isExpanded,
    setIsExpanded,
  ] = useState(true);

  const {
    logout,
    user,
  } = useAuth();

  const userRole =
    user?.role as
      | UserRole
      | undefined;

  const visibleMenuItems =
    useMemo(() => {
      if (!userRole) {
        return [];
      }

      return menuItems.filter(
        (item) => {
          if (
            !item.allowedRoles
          ) {
            return true;
          }

          return item.allowedRoles.includes(
            userRole,
          );
        },
      );
    }, [userRole]);

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
            (current) =>
              !current,
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
        {isExpanded && (
          <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Operacional
          </p>
        )}

        <nav className="flex flex-col gap-2">
          {visibleMenuItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  title={
                    !isExpanded
                      ? item.title
                      : undefined
                  }
                  className={({
                    isActive,
                  }) =>
                    `group flex items-center rounded-2xl text-sm font-semibold transition-all ${
                      isExpanded
                        ? "gap-3 px-3.5 py-3"
                        : "justify-center p-3"
                    } ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
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
                    </>
                  )}
                </NavLink>
              );
            },
          )}
        </nav>
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
                {getInitials(
                  user?.name,
                )}
              </div>

              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <span
                    className="block truncate text-sm font-bold text-slate-900"
                    title={
                      user?.name
                    }
                  >
                    {user?.name ||
                      "Carregando..."}
                  </span>

                  <span
                    className="mt-0.5 block truncate text-[11px] font-medium text-slate-500"
                    title={
                      user?.email
                    }
                  >
                    {user?.email ||
                      "Aguarde"}
                  </span>

                  {userRole && (
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-blue-600">
                      {getRoleLabel(
                        userRole,
                      )}
                    </span>
                  )}
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