import { Outlet, useNavigation } from "react-router-dom";
import { AppSidebar } from "../../../components/layout/SideBar";

const Home = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-50">
      <AppSidebar />

      <div className="relative flex-1 w-full overflow-y-auto">
        {isLoading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/90 px-5 py-3 text-sm text-slate-600 shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              Carregando dados...
            </div>
          </div>
        )}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;