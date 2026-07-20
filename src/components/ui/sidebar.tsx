import { useState } from "react";
import { 
  LayoutDashboard, 
  PackageSearch, 
  FileText, 
  Settings, 
  Users, 
  LogOut, 
  MonitorPlay,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { title: "Visão Geral", icon: LayoutDashboard, url: "#" },
  { title: "Rastreamento", icon: PackageSearch, url: "#" },
  { title: "Monitoramento", icon: MonitorPlay, url: "#" },
  { title: "Relatórios", icon: FileText, url: "#" },
];

const adminItems = [
  { title: "Usuários", icon: Users, url: "#" },
  { title: "Configurações", icon: Settings, url: "#" },
];

export function AppSidebar() {
  // Estado manual que controla as setas e o tamanho da barra
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside 
      className={`bg-white border-r border-cinza/20 h-screen transition-all duration-300 relative flex flex-col ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* BOTÃO DE SETAS (RECOLHER/EXPANDIR) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-7 bg-white border border-cinza/20 rounded-full p-1 text-cinza hover:text-azul-primario hover:bg-azul-primario/10 transition-colors z-50 shadow-sm"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* CABEÇALHO (Logo) */}
      <div className={`p-6 border-b border-cinza/10 flex items-center transition-all min-h-[85px] ${isExpanded ? "justify-start" : "justify-center px-0"}`}>
        {isExpanded ? (
          <div className="flex flex-col items-start select-none w-full">
            <h1 className="text-azul-primario text-2xl font-black tracking-tighter italic leading-none">
              TIJUCA
            </h1>
            <div className="flex items-center gap-2 w-full mt-1">
              <span className="text-azul-terciario text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                WMS ADMIN
              </span>
              <div className="h-[1px] bg-azul-terciario/30 flex-grow"></div>
            </div>
          </div>
        ) : (
          <h1 className="text-azul-primario text-3xl font-black italic leading-none select-none">
            T
          </h1>
        )}
      </div>

      {/* CONTEÚDO PRINCIPAL (Menus) */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Operacional */}
        <div>
          {isExpanded && (
            <p className="text-xs font-bold text-cinza/60 mb-3 px-2 uppercase tracking-wider whitespace-nowrap transition-opacity duration-300">
              Operacional
            </p>
          )}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                title={!isExpanded ? item.title : undefined} // Tooltip nativo, sem erro no React
                className={`flex items-center rounded-lg text-cinza hover:bg-azul-primario/5 hover:text-azul-primario transition-all font-medium text-sm group
                  ${isExpanded ? "gap-3 px-3 py-2.5" : "justify-center p-3"}
                `}
              >
                <item.icon className="w-5 h-5 min-w-[20px] text-cinza/70 group-hover:text-azul-primario transition-colors" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 block" : "opacity-0 hidden"}`}>
                  {item.title}
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* Administração */}
        <div>
          {isExpanded && (
            <p className="text-xs font-bold text-cinza/60 mb-3 px-2 uppercase tracking-wider whitespace-nowrap transition-opacity duration-300">
              Administração
            </p>
          )}
          <nav className="flex flex-col gap-2">
            {adminItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                title={!isExpanded ? item.title : undefined}
                className={`flex items-center rounded-lg text-cinza hover:bg-azul-primario/5 hover:text-azul-primario transition-all font-medium text-sm group
                  ${isExpanded ? "gap-3 px-3 py-2.5" : "justify-center p-3"}
                `}
              >
                <item.icon className="w-5 h-5 min-w-[20px] text-cinza/70 group-hover:text-azul-primario transition-colors" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 block" : "opacity-0 hidden"}`}>
                  {item.title}
                </span>
              </a>
            ))}
          </nav>
        </div>

      </div>

      {/* RODAPÉ (Usuário) */}
      <div className="p-4 border-t border-cinza/10">
        <div className={`flex items-center ${isExpanded ? "justify-between px-2" : "justify-center"} py-2 transition-all`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 min-w-[32px] rounded-full bg-azul-primario text-white flex items-center justify-center font-bold text-xs">
              JD
            </div>
            {isExpanded && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm font-bold text-preto">João Doe</span>
                <span className="text-[10px] text-cinza">Gestor de Lote</span>
              </div>
            )}
          </div>
          
          {isExpanded && (
            <button className="text-cinza hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50" title="Sair">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

    </aside>
  );
}