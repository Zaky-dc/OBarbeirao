import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/atendimentos`)
      .then((res) => setAtendimentos(res.data))
      .catch((err) => console.error("Erro ao buscar atendimentos:", err));

    axios
      .get(`${BASE_URL}/checkin/fila-presencial`)
      .then((res) => setCheckins(res.data.dados))
      .catch((err) => console.error("Erro ao buscar fila:", err));

    axios
      .get(`${BASE_URL}/barbeiros`)
      .then((res) => setBarbeiros(res.data))
      .catch((err) => console.error("Erro ao buscar barbeiros:", err));
  }, []);
  
  const receitaTotal = atendimentos.reduce((acc, a) => acc + a.valorTotal, 0);

 return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow text-center">
          <p className="text-sm text-slate-500">Atendimentos</p>
          <p className="text-xl font-bold text-green-600">{atendimentos.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow text-center">
          <p className="text-sm text-slate-500">Fila Presencial</p>
          <p className="text-xl font-bold text-blue-600">{checkins.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow text-center">
          <p className="text-sm text-slate-500">Barbeiros Ativos</p>
          <p className="text-xl font-bold text-amber-600">{barbeiros.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow text-center">
          <p className="text-sm text-slate-500">Receita Total</p>
          <p className="text-xl font-bold text-slate-800 dark:text-white">{receitaTotal} MZN</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-700 dark:text-white mt-6">Últimos Atendimentos</h2>
        <ul className="mt-2 space-y-2">
         {[...atendimentos].slice(0, 5).map((a) => (
            <li key={a._id} className="bg-white dark:bg-slate-800 p-3 rounded shadow">
              <p className="text-sm text-slate-700 dark:text-white">
                <strong>{a.cliente.nome}</strong> atendido por <strong>{a.barbeiro.nome}</strong> — {a.valorTotal} MZN
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Serviços: {a.servicos.map(s => s.nome).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}