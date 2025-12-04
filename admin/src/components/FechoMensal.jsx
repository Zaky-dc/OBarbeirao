import { useEffect, useState } from "react";
import axios from "axios";

export default function FechoMensal() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [resumo, setResumo] = useState([]);
  const [loading, setLoading] = useState(false); // Adicionado estado de loading
  
  const BASE_URL = "https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    setLoading(true);
    // Recupera o token do localStorage (ajuste a chave se for diferente, ex: 'user_token')
    const token = localStorage.getItem("token"); 

    axios.get(`${BASE_URL}/barbeiros/fecho-mensal?mes=${mes}&ano=${ano}`, {
        headers: {
          // Adiciona o cabeçalho de autorização para resolver o erro 401
          Authorization: token ? `Bearer ${token}` : "", 
        }
      })
      .then(res => {
        // Garante que é um array antes de setar
        if (Array.isArray(res.data)) {
            setResumo(res.data);
        } else {
            setResumo([]);
            console.warn("Formato inesperado de resposta:", res.data);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar fecho mensal:", err);
        // Opcional: Se der 401, talvez redirecionar para login?
        if (err.response && err.response.status === 401) {
            alert("Sessão expirada ou não autorizado.");
        }
      })
      .finally(() => setLoading(false));
  }, [mes, ano]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fecho Mensal</h1>

      <div className="flex gap-4">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="border px-2 py-1 rounded">
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} - {new Date(0, i).toLocaleString("pt", { month: "long" })}</option>
          ))}
        </select>
        <input 
            type="number" 
            value={ano} 
            onChange={(e) => setAno(Number(e.target.value))} 
            className="border px-2 py-1 rounded w-24" 
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {resumo.length === 0 && <p className="text-slate-500">Nenhum dado encontrado.</p>}
            
            {resumo.map((r, i) => {
            // CORREÇÃO DO CRASH: Proteção contra valores nulos/undefined
            const receita = r.receita || 0;
            const comissao = r.comissao || 0;
            const taxa = r.taxaComissao || 0;

            return (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-2">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        {r.barbeiro || "Barbeiro Desconhecido"}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Atendimentos: {r.totalAtendimentos || 0}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Receita: {receita.toFixed(2)} MZN
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                        Comissão ({(taxa * 100).toFixed(0)}%): {comissao.toFixed(2)} MZN
                    </p>
                </div>
            );
            })}
        </div>
      )}
    </div>
  );
}
