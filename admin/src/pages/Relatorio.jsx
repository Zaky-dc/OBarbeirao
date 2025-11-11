import { useEffect, useState } from "react";
import axios from "axios";


export default function Relatorio() {
  const [filtros, setFiltros] = useState({
    nome: "",
    telefone: "",
    servico: "",
    barbeiro: "",
    data: "",
  });
  const [resultados, setResultados] = useState([]);
  const BASE_URL = "https://o-barbeirao-back.vercel.app/api";

  const buscar = () => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    axios
      .get(`${BASE_URL}/atendimentos/relatorio?${params.toString()}`)
      .then((res) => setResultados(res.data))
      .catch((err) => console.error("Erro ao buscar relatório:", err));
  };

  useEffect(() => {
    buscar(); // busca inicial
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Relatório de Atendimentos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {["nome", "telefone", "servico", "barbeiro"].map((campo) => (
          <input
            key={campo}
            type="text"
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            value={filtros[campo]}
            onChange={(e) =>
              setFiltros({ ...filtros, [campo]: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
        ))}
        <input
          type="date"
          value={filtros.data}
          onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={buscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      <table className="w-full text-left border-collapse mt-6">
        <thead>
          <tr className="bg-slate-200 dark:bg-slate-700">
            <th className="p-2">Nome</th>
            <th className="p-2">Telefone</th>
            <th className="p-2">Horário</th>
            <th className="p-2">Serviços</th>
            <th className="p-2">Barbeiro</th>
            <th className="p-2">Valor</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((r) => (
            <tr key={r._id} className="border-b dark:border-slate-700">
              <td className="p-2">{r.cliente?.nome}</td>
              <td className="p-2">{r.cliente?.telefone || "—"}</td>
              <td className="p-2">
                {new Date(r.data).toLocaleDateString("pt-MZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                às{" "}
                {new Date(r.data).toLocaleTimeString("pt-MZ", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
              <td className="p-2">
                {r.servicos.map((s) => s.nome).join(", ")}
              </td>
              <td className="p-2">
                {r.barbeiro?.nome || (
                  <span className="italic text-slate-400">Não registrado</span>
                )}
              </td>
              <td className="p-2">{r.valorTotal?.toFixed(2)} MZN</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
