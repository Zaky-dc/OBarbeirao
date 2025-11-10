import { useState } from "react";
import axios from "axios";
import Toast from "./Toast";

export default function Checkout({ carrinho, setCarrinho }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [toast, setToast] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const total = carrinho.reduce((acc, servico) => acc + servico.preco, 0);

  const hoje = new Date();
  const hojeISO = hoje.toISOString().slice(0, 16);

  const limite = new Date();
  limite.setDate(limite.getDate() + 14);
  const limiteISO = limite.toISOString().slice(0, 16);

  const handleSubmit = async () => {
    if (!nome || !telefone || !data || carrinho.length === 0) {
      setToast({ mensagem: "Preencha todos os campos!", tipo: "erro" });
      return;
    }
  
    const payload = {
      nome,
      telefone,
      servicos: carrinho.map((s) => ({
        nome: s.nome,
        preco: s.preco,
        imageUrl: s.imageUrl,
      })),
      horario: data, // ← adiciona a data como campo "horario"
    };
  
    try {
      const res = await axios.post(`${BASE_URL}/checkin`, payload);
      console.log("Check-in registrado:", res.data);
      setToast({ mensagem: "Agendamento confirmado!", tipo: "sucesso" });
      setCarrinho([]);
      setNome("");
      setTelefone("");
      setData("");
    } catch (err) {
      console.error("Erro ao registrar check-in:", err);
      setToast({ mensagem: "Erro ao agendar. Tente novamente.", tipo: "erro" });
    }
  };
  

  return (
    <>
      <section id="checkout" className="py-20 px-6 bg-zinc-900 text-zinc-100">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center tracking-wide">
            Finalizar Agendamento
          </h2>

          <ul className="mb-6 space-y-2 bg-zinc-800 p-4 rounded shadow">
            {carrinho.map((s) => (
              <li key={s._id} className="flex justify-between border-b border-zinc-700 pb-2 text-amber-300">
                <span>{s.nome}</span>
                <span className="font-semibold">{s.preco} MZN</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-right text-lg font-bold text-amber-500">
            Total: {total} MZN
          </div>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mb-3 p-3 bg-zinc-800 text-white border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full mb-3 p-3 bg-zinc-800 text-white border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="datetime-local"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              e.target.blur();
            }}
            min={hojeISO}
            max={limiteISO}
            className="w-full mb-3 p-3 bg-zinc-800 text-white border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          {data && (
            <div className="text-sm text-amber-400 mb-6">
              Data selecionada:{" "}
              {new Date(data).toLocaleString("pt-MZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-amber-600 text-black font-bold py-3 rounded hover:bg-amber-700 transition"
          >
            Confirmar Agendamento
          </button>
        </div>
      </section>

      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

