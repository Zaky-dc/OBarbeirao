import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery().get("query") || "";
  const [resultados, setResultados] = useState({ atendimentos: [], checkins: [], agendamentos: [] });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setCarregando(true);
    axios.get(`http://localhost:3000/search?query=${query}`)
      .then(res => setResultados(res.data))
      .catch(err => console.error("Erro ao buscar:", err))
      .finally(() => setCarregando(false));
  }, [query]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Resultados para: <span className="text-blue-600">{query}</span></h1>

      {carregando ? (
        <p className="text-slate-500">Carregando resultados...</p>
      ) : (
        <>
          <ResultadoGrupo titulo="Atendimentos" dados={resultados.atendimentos} tipo="atendimento" />
          <ResultadoGrupo titulo="Check-ins" dados={resultados.checkins} tipo="checkin" />
          <ResultadoGrupo titulo="Agendamentos" dados={resultados.agendamentos} tipo="agendamento" />
          <ResultadoGrupo titulo="Agendamentos Online" dados={resultados.agendamentosOnline} tipo="checkin" />
        </>
      )}
    </div>
  );
}

function ResultadoGrupo({ titulo, dados, tipo }) {
  if (!dados || dados.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{titulo}</h2>
      <ul className="space-y-2">
        {dados.map((item, i) => (
          <li key={i} className="p-4 bg-white dark:bg-slate-800 rounded shadow">
            <p className="font-bold text-slate-800 dark:text-white">{item.cliente?.nome || "Sem nome"}</p>
            <p className="text-sm text-slate-500">{item.cliente?.telefone || "Sem telefone"}</p>
            {tipo === "atendimento" && (
              <p className="text-sm text-green-600">Valor: {item.valorTotal} MZN</p>
            )}
            {tipo === "checkin" && (
              <p className="text-sm text-blue-600">Horário: {new Date(item.horario).toLocaleString()}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}