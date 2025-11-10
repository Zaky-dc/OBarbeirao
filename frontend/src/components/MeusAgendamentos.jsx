import { useState } from "react";
import axios from "axios";
import { showToast } from "./toastManager.jsx"; 
import InputMask from "react-input-mask";

export default function MeusAgendamentos() {
  const [telefone, setTelefone] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  
  const BASE_URL = import.meta.env.VITE_API_URL;

  const consultar = async () => {
    const numeroLimpo = telefone.replace(/\D/g, "");

    if (!numeroLimpo) {
      showToast("Digite seu telefone para consultar.", "erro");
      setAgendamentos([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/checkin?telefone=${numeroLimpo}`);
      const { total, dados } = res.data;

      if (total === 0) {
        showToast("Nenhum agendamento encontrado para este número.","erro");
        setAgendamentos([]);
      } else {
        setAgendamentos(dados);
        showToast(`Foram encontrados ${total} agendamentos.`, "sucesso");
        setTimeout(() => {
          document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch (err) {
      console.error("Erro ao consultar:", err);
      showToast("Faça refresh e tente novamente!","erro");
      setAgendamentos([]);
    }
  };

  const cancelarAgendamento = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/checkin/cancelar/${id}`);
      setAgendamentos((prev) => prev.filter((a) => a._id !== id));
      showToast("Agendamento cancelado com sucesso.", "sucesso");
    } catch (err) {
      console.error("Erro ao cancelar:", err);
      showToast("Falha na operação, tente novamente.", "erro");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 pt-28">
    <div className="max-w-xl mx-auto">
      <h2
        id="topo-agendamentos"
        className="scroll-mt-28 text-3xl font-bold text-amber-500 mb-6 text-center"
      >
         Meus Agendamentos
      </h2>
  

        <input
          type="tel"
          placeholder="Digite seu telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full mb-4 p-3 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <button
          onClick={consultar}
          className="w-full bg-amber-600 text-black font-bold py-2 rounded hover:bg-amber-700 transition"
        >
          Consultar
        </button>


        {agendamentos.length > 0 && (
          <ul id="resultados" className="mt-6 space-y-4">
            {agendamentos.map((a) => (
              <li key={a._id} className="bg-zinc-800 p-4 rounded shadow">
                <p><strong>Nome:</strong> {a.nome}</p>
                <p><strong>Data:</strong> {new Date(a.horario).toLocaleString("pt-MZ")}</p>
                <p><strong>Status:</strong> {a.atendido ? " Confirmado" : "Pendente"}</p>
                <ul className="list-disc ml-6 text-amber-300 mt-2">
                  {a.servicos.map((s, i) => (
                    <li key={i}>{s.nome} — {s.preco} MZN</li>
                  ))}
                </ul>
                {!a.atendido && (
                  <button
                    onClick={() => cancelarAgendamento(a._id)}
                    className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Cancelar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
