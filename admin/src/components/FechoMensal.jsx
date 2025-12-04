import { useEffect, useState } from "react";
import axios from "axios";

export default function FechoMensal() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [resumo, setResumo] = useState([]);
  const BASE_URL = "https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    axios.get(`${BASE_URL}/barbeiros/fecho-mensal?mes=${mes}&ano=${ano}`)
      .then(res => setResumo(res.data))
      .catch(err => console.error("Erro ao buscar fecho mensal:", err));
  }, [mes, ano]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fecho Mensal</h1>

      <div className="flex gap-4">
        <select value={mes} onChange={(e) => setMes(e.target.value)} className="border px-2 py-1 rounded">
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} - {new Date(0, i).toLocaleString("pt", { month: "long" })}</option>
          ))}
        </select>
        <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} className="border px-2 py-1 rounded w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {resumo.map((r, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{r.barbeiro}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Atendimentos: {r.totalAtendimentos}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Receita: {r.receita} MZN</p>
            <p className="text-sm text-green-600 font-semibold">Comissão ({r.taxaComissao * 100}%): {r.comissao.toFixed(2)} MZN</p>
          </div>
        ))}
      </div>
    </div>
  );
}
