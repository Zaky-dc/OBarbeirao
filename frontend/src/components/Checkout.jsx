import { useEffect, useState } from "react";
import axios from "axios";
import Toast from "./Toast";

export default function Checkout({ carrinho, setCarrinho }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeiroId, setBarbeiroId] = useState(null);
  const [toast, setToast] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || "https://o-barbeirao-back.vercel.app/api";
  const total = carrinho.reduce((acc, s) => acc + s.preco, 0);

  const hoje = new Date();
  const hojeISO = hoje.toISOString().slice(0, 16);
  const limite = new Date();
  limite.setDate(limite.getDate() + 14);
  const limiteISO = limite.toISOString().slice(0, 16);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/barbeiros`)
      .then((res) => setBarbeiros(res.data))
      .catch((err) => console.error("Erro ao carregar barbeiros:", err));
  }, []);

  const handleSubmit = async () => {
    if (!nome || !telefone || !data || carrinho.length === 0) {
      setToast({ mensagem: "Preencha todos os campos!", tipo: "erro" });
      return;
    }

    const barbeiroSelecionado =
      typeof barbeiroId === "string"
        ? barbeiros.find((b) => b._id === barbeiroId) || null
        : null;

    const payload = {
      nome,
      telefone: telefone.replace(/\D/g, ""),
      servicos: carrinho.map((s) => ({
        nome: s.nome,
        preco: s.preco,
        imageUrl: s.imageUrl,
      })),
      horario: data,
      barbeiro: barbeiroSelecionado,
      origem: "online",
    };

    setEnviando(true);
    try {
      await axios.post(`${BASE_URL}/checkin`, payload);
      setToast({ mensagem: "Agendamento confirmado!", tipo: "sucesso" });
      setCarrinho([]);
      setNome("");
      setTelefone("");
      setData("");
      setBarbeiroId(null);
    } catch (err) {
      console.error("Erro ao registrar check-in:", err);
      setToast({ mensagem: "Erro ao agendar. Tente novamente.", tipo: "erro" });
    } finally {
      setEnviando(false);
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

          {/* Seletor de barbeiro */}
          <div className="mb-6 space-y-3">
            <h3 className="text-sm text-amber-400 font-semibold">Escolha o barbeiro:</h3>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="barbeiro"
                  value=""
                  checked={barbeiroId === null}
                  onChange={() => setBarbeiroId(null)}
                />
                <span className="text-white">Não tenho preferência</span>
              </label>

              {barbeiros.map((b) => {
                const url = b.imageUrl.replace("/upload/", "/upload/q_auto,f_auto/");
                return (
                  <label key={b._id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="barbeiro"
                      value={b._id}
                      checked={barbeiroId === b._id}
                      onChange={() => setBarbeiroId(b._id)}
                    />
                    <img
                      src={url}
                      alt={b.nome}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-white">{b.nome}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={enviando}
            className="w-full bg-amber-600 text-black font-bold py-3 rounded hover:bg-amber-700 transition disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Confirmar Agendamento"}
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

