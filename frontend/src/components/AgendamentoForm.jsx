import { useState } from "react";
import axios from "axios";

export default function AgendamentoForm({ carrinho, onClose, setCarrinho }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL || "https://o-barbeirao-back.vercel.app/api";

  const handleSubmit = async () => {
    try {
      const payload = {
        cliente: nome,
        telefone,
        data,
        servicos: carrinho,
      };
      await axios.post(`${BASE_URL}/agendamentos`, payload);
      alert("Agendamento realizado com sucesso!");
      setCarrinho([]);
      onClose();
    } catch (err) {
      console.error("Erro ao agendar:", err);
      alert("Erro ao agendar. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-amber-600">Agendar Corte</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-amber-600 text-black px-4 py-2 rounded hover:bg-amber-700 transition"
        >
          Confirmar Agendamento
        </button>
        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 hover:underline block"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}