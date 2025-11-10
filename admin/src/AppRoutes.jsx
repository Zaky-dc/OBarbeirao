
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Fila from "./pages/Fila";
import Relatorio from "./pages/Relatorio";
import CarrinhoPage from "./pages/CarrinhoPage";
import CadastroServico from "./components/CadastroServico";
import ListaServicos from "./components/ListaServicos";
import EditarServico from "./components/EditarServico";
import LoginAdmin from "./pages/LoginAdmin";
import RotaProtegida from "./components/RotaProtegida";
import { useAuth } from "./context/AuthContext";
import FechoMensal from "./components/FechoMensal";
import PainelBarbeiros from "./components/PainelBarbeiros";
import Agendamentos from "./components/Agendamentos";
import SearchPage from "./pages/SearchPage";

export default function AppRoutes() {
  const { logado } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 transition-all duration-500">
      <Routes>
        <Route path="/login" element={<LoginAdmin />} />
        <Route
          path="/*"
          element={
            <RotaProtegida>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                     <Route index element={<Dashboard />} />
                      <Route path="fila" element={<Fila />} />
                      <Route path="relatorio" element={<Relatorio />} />
                      <Route path="upload-servico" element={<CadastroServico />} />
                      <Route path="servicos" element={<ListaServicos />} />
                      <Route path="editar-servico/:id" element={<EditarServico />} />
                      <Route path="barbeiros" element={<PainelBarbeiros/>}/>
                      <Route path="fecho" element={<FechoMensal/>}/>
                      <Route path="agendamentos" element={<Agendamentos/>}/>
                      <Route path="/search" element={<SearchPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </RotaProtegida>
          }
        />
      </Routes>
    </div>
  );
}