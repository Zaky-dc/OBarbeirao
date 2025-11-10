import { useState } from "react";
import axios from "axios";
import Catalogo from "./Catalogo";

export default function CardFila({
  cliente,
  servicosIniciais = [],
  barbeiros,
  onAtendimentoFinalizado,
}) {
  const [servicos, setServicos] = useState(servicosIniciais || []);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  const handleFinalizar = async () => {
    if (!barbeiroSelecionado || servicos.length === 0) {
      alert("Selecione pelo menos um serviço e um barbeiro.");
      return;
    }

    const payload = {
      cliente: {
        nome: cliente.nome,
        telefone: cliente.telefone,
      },
      barbeiro: {
        id: barbeiroSelecionado,
        nome: barbeiros.find((b) => b._id === barbeiroSelecionado)?.nome || "",
      },
      servicos,
    };

    try {
      console.log("Payload enviado:", payload);
      await axios.post(`${BASE_URL}/atendimentos`, payload);
      await axios.delete(`${BASE_URL}/checkin/${cliente._id}`);

      onAtendimentoFinalizado(cliente._id);
    } catch (err) {
      console.error("Erro ao finalizar atendimento:", err);
      alert("Erro ao finalizar atendimento.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow space-y-4 relative">
      {/* Nome e contacto */}
      <div>
        <p className="text-lg font-bold text-slate-800 dark:text-white">
          {cliente.nome}
        </p>
        <p className="text-sm text-amber-600 font-semibold">
          {cliente.telefone}
        </p>
      </div>

      {/* Lista de serviços */}
      <div className="space-y-1">
        {servicos.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Nenhum serviço selecionado.
          </p>
        ) : (
          <ul className="text-sm text-slate-700 dark:text-slate-300">
            {servicos.map((s, i) => (
              <li key={i}>
                • {s.nome} — {s.preco} MZN
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botão para abrir catálogo */}
      <button
        onClick={() => setModalAberto(true)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Adicionar Serviço
      </button>

      {/* Seleção de barbeiro */}
      <select
        value={barbeiroSelecionado}
        onChange={(e) => setBarbeiroSelecionado(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Selecionar Barbeiro</option>
        {barbeiros.map((b) => (
          <option key={b._id} value={b._id}>
            {b.nome}
          </option>
        ))}
      </select>

      {/* Botão de finalizar */}
      <button
        onClick={handleFinalizar}
        disabled={!barbeiroSelecionado || servicos.length === 0}
        className={`w-full py-2 rounded text-white ${
          !barbeiroSelecionado || servicos.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Finalizar Atendimento
      </button>

      {/* Modal com catálogo */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg w-full max-w-5xl h-[90vh] overflow-hidden relative flex flex-col">
            {/* Botão Fechar */}
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 z-10 text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Fechar
            </button>

            {/* Conteúdo com rolagem */}
            <div className="overflow-y-auto p-4 pt-12">
              <Catalogo carrinho={servicos} setCarrinho={setServicos} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
