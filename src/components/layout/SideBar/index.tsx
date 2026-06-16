import { useState } from "react";

import {
LayoutDashboard,
MonitorSmartphone,
Image,
ListVideo,
CalendarDays,
Users,
Settings,
LogOut,
ChevronLeft,
ChevronRight,
} from "lucide-react";

import { useAuth } from "../../../contexts/auth.context";

const menuItems = [
{
title: "Dashboard",
icon: LayoutDashboard,
url: "/home/dashboard",
},

{
title: "Dispositivos",
icon: MonitorSmartphone,
url: "/home/devices",
},

{
title: "Mídias",
icon: Image,
url: "/home/media",
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

const adminItems = [
{
title: "Usuários",
icon: Users,
url: "/home/users",
},

{
title: "Configurações",
icon: Settings,
url: "/home/settings",
},
];

const getInitials = (name?: string) => {
if (!name) return "--";

const names = name.trim().split(" ");

if (names.length >= 2) {
return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
}

return name.substring(0, 2).toUpperCase();
};

export function AppSidebar() {
const [isExpanded, setIsExpanded] = useState(true);

const { logout, user } = useAuth();

return (
<aside
className={`bg-white border-r border-cinza/20 h-screen transition-all duration-300 relative flex flex-col ${
        isExpanded ? "w-64" : "w-20"
      }`}
>
<button
onClick={() => setIsExpanded(!isExpanded)}
className="absolute -right-3 top-7 bg-white border border-cinza/20 rounded-full p-1 text-cinza hover:text-azul-primario hover:bg-azul-primario/10 transition-colors z-50 shadow-sm"
>
{isExpanded ? ( <ChevronLeft className="w-4 h-4" />
) : ( <ChevronRight className="w-4 h-4" />
)} </button>

  <div
    className={`p-6 border-b border-cinza/10 flex items-center transition-all min-h-21 ${
      isExpanded
        ? "justify-start"
        : "justify-center px-0"
    }`}
  >
    {isExpanded ? (
      <div className="flex flex-col">
      <h1 className="text-2xl font-extrabold text-blue-600">
        Indoor Player
      </h1>
    
      <span className="text-xs text-gray-500">
        Gerenciamento de TVs e Conteúdo
      </span>
    </div>
    ) : (
      <h1 className="text-azul-primario text-3xl font-black leading-none select-none">
        I
      </h1>
    )}
  </div>

  <div className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
    <div>
      {isExpanded && (
        <p className="text-xs font-bold text-cinza/60 mb-3 px-2 uppercase tracking-wider">
          Operacional
        </p>
      )}

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.url}
            title={!isExpanded ? item.title : undefined}
            className={`flex items-center rounded-lg text-cinza hover:bg-azul-primario/5 hover:text-azul-primario transition-all font-medium text-sm group ${
              isExpanded
                ? "gap-3 px-3 py-2.5"
                : "justify-center p-3"
            }`}
          >
            <item.icon className="w-5 h-5 min-w-5 text-cinza/70 group-hover:text-azul-primario transition-colors" />

            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded
                  ? "opacity-100 block"
                  : "opacity-0 hidden"
              }`}
            >
              {item.title}
            </span>
          </a>
        ))}
      </nav>
    </div>

    <div>
      {isExpanded && (
        <p className="text-xs font-bold text-cinza/60 mb-3 px-2 uppercase tracking-wider">
          Administração
        </p>
      )}

      <nav className="flex flex-col gap-2">
        {adminItems.map((item) => (
          <a
            key={item.title}
            href={item.url}
            title={!isExpanded ? item.title : undefined}
            className={`flex items-center rounded-lg text-cinza hover:bg-azul-primario/5 hover:text-azul-primario transition-all font-medium text-sm group ${
              isExpanded
                ? "gap-3 px-3 py-2.5"
                : "justify-center p-3"
            }`}
          >
            <item.icon className="w-5 h-5 min-w-5 text-cinza/70 group-hover:text-azul-primario transition-colors" />

            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded
                  ? "opacity-100 block"
                  : "opacity-0 hidden"
              }`}
            >
              {item.title}
            </span>
          </a>
        ))}
      </nav>
    </div>
  </div>

  <div className="p-4 border-t border-cinza/10">
    <div
      className={`flex items-center ${
        isExpanded
          ? "justify-between px-2"
          : "justify-center"
      } py-2`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 min-w-8 rounded-full bg-blue-500 text-white  flex items-center justify-center font-bold text-xs">
          {user ? getInitials(user.name) : "--"}
        </div>

        {isExpanded && (
          <div className="flex flex-col overflow-hidden">
            <span
              className="text-sm font-bold text-preto truncate"
              title={user?.name}
            >
              {user?.name || "Carregando..."}
            </span>

            <span
              className="text-[10px] text-cinza truncate"
              title={user?.email}
            >
              {user?.email || "Aguarde"}
            </span>
          </div>
        )}
      </div>

      {isExpanded && (
        <button
          className="text-cinza hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50"
          title="Sair"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
</aside>


);
}
