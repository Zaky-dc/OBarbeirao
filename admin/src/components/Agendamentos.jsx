import { useEffect, useState } from "react";
import axios from "axios";

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [aba, setAba] = useState("pendentes");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const pendentes = agendamentos.filter((a) => !a.atendido && !a.cancelado);
  const historico = agendamentos.filter((a) => a.atendido || a.cancelado);
  const totalPaginas = Math.ceil(historico.length / itensPorPagina);
  const historicoPaginado = historico.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = () => {
    axios
      .get(`${BASE_URL}/checkin/agendamentos`)
      .then((res) => setAgendamentos(res.data))
      .catch((err) => console.error("Erro ao buscar agendamentos:", err));
  };

  const atualizarStatus = (id, status) => {
    axios
      .patch(`${BASE_URL}/checkin/agendamentos/${id}`, { status })
      .then(() => carregarAgendamentos())
      .catch((err) => console.error("Erro ao atualizar agendamento:", err));
  };

 return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Agendamentos Online
      </h1>

      <div className="flex gap-4 border-b border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setAba("pendentes")}
          className={`px-4 py-2 font-medium transition-all ${
            aba === "pendentes"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setAba("historico")}
          className={`px-4 py-2 font-medium transition-all ${
            aba === "historico"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Histórico
        </button>
      </div>

     {aba === "pendentes" && (
  <>
    {pendentes.length === 0 ? (
      <div className="text-center text-slate-500 dark:text-slate-400 italic py-10">
        Nenhum agendamento pendente no momento.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendentes.map((a) => {
          console.log("🔍 Barbeiro recebido:", a.barbeiro);

          return (
            <div
              key={a._id}
              className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-2"
            >
              <h2 className="text-lg font-bold">{a.nome}</h2>
              <p>Telefone: <div className="text-green-800 font-bold">{a.telefone}</div></p>
              <p>Horário: <div className="font-semibold">{new Date(a.horario).toLocaleString()}</div></p>
              <p>Serviços: <div className="font-semibold">{a.servicos.map((s) => s.nome).join(", ")}</div></p>
              <p>Corte com:</p>

              <div className="flex items-center gap-2 mt-2">
                {a.barbeiro && typeof a.barbeiro === "object" ? (
                  <>
                    <img
                      src={a.barbeiro.imageUrl}
                      alt={a.barbeiro.nome}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      <div className="font-semibold">{a.barbeiro.nome}</div>
                    </span>
                  </>
                ) : (
                  <span className="italic text-sm text-slate-500">
                    Sem preferência
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => atualizarStatus(a._id, "aprovado")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => atualizarStatus(a._id, "cancelado")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </>
)}


      {aba === "historico" && (
        <div className="space-y-3 pr-2 md:pr-8 lg:pr-16 xl:pr-24">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 dark:bg-slate-700">
                  <th className="p-2">Nome</th>
                  <th className="p-2">Telefone</th>
                  <th className="p-2">Horário</th>
                  <th className="p-2">Barbeiro</th>
                  <th className="p-2">Serviços</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {historicoPaginado.map((a) => (
                  <tr key={a._id} className="border-b dark:border-slate-700">
                    <td className="p-2">{a.nome}</td>
                    <td className="p-2">{a.telefone}</td>
                    <td className="p-2">
                      {new Date(a.horario).toLocaleDateString("pt-MZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      às{" "}
                      {new Date(a.horario).toLocaleTimeString("pt-MZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td className="p-2">
                      {a.barbeiro ? (
                        a.barbeiro.nome
                      ) : (
                        <span className="italic text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-2">
                      {a.servicos.map((s) => s.nome).join(", ")}
                    </td>
                    <td className="p-2">
                      {a.atendido
                        ? "Aprovado"
                        : a.cancelado
                        ? "Cancelado"
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-4">
              <button
                onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                disabled={paginaAtual === 1}
                className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
                }
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
              >
                Próxima →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
