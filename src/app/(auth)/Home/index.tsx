import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useNavigation } from "react-router-dom";

import { AppSidebar } from "../../../components/layout/SideBar";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="flex min-h-dvh bg-[#f3f6fa] text-slate-900 lg:h-dvh">
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="relative min-w-0 flex-1 lg:h-dvh">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setMobileMenuOpen(true)}
          className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
        >
          <Menu size={19} />
        </button>

        <div className="relative min-h-dvh pt-14 lg:h-dvh lg:pt-0">
          {isLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-lg">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                Atualizando módulo...
              </div>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
