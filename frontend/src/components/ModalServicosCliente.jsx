import { useState, useEffect } from "react";
import Catalogo from "./Catalogo";
import axios from "axios";
import { showToast } from "./toastManager";

export default function ModalServicosCliente({ checkin, fecharModal, BASE_URL }) {
  const [carrinho, setCarrinho] = useState([]);
  const [telefoneConfirmado, setTelefoneConfirmado] = useState("");
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeiroId, setBarbeiroId] = useState(null);

  useEffect(() => {
    setCarrinho([]);
    setTelefoneConfirmado("");
    setBarbeiroId(null);

    axios
      .get(`${BASE_URL}/barbeiros`)
      .then((res) => setBarbeiros(res.data))
      .catch((err) => console.error("Erro ao carregar barbeiros:", err));
  }, [checkin]);

  const salvarServicos = async () => {
    if (telefoneConfirmado.replace(/\D/g, "") !== checkin.telefone) {
      showToast("Telefone não confere com o check-in.", "erro");
      return;
    }

    const servicosCompletos = carrinho.map((s) => ({
      nome: s.nome,
      preco: s.preco,
      imageUrl: s.imageUrl,
    }));

    const barbeiroSelecionado =
      typeof barbeiroId === "string"
        ? barbeiros.find((b) => b._id === barbeiroId) || null
        : null;

    try {
      await axios.patch(`${BASE_URL}/checkin/${checkin._id}/servicos`, {
        servicos: servicosCompletos,
        barbeiro: barbeiroSelecionado,
      });

      showToast("Serviços atualizados com sucesso!", "sucesso");
      fecharModal();
    } catch (err) {
      console.error("Erro ao salvar serviços:", err);
      showToast("Erro ao salvar serviços. Tente novamente.", "erro");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Escolher serviços para {checkin.nome}
        </h2>

        <div className="flex-grow overflow-y-auto mb-4">
          <Catalogo carrinho={carrinho} setCarrinho={setCarrinho} />
        </div>

        {carrinho.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirme seu telefone:
            </label>
            <input
              type="tel"
              value={telefoneConfirmado}
              onChange={(e) => setTelefoneConfirmado(e.target.value)}
              placeholder="Digite seu telefone"
              className="w-full px-4 py-2 border rounded bg-white text-gray-800 placeholder-gray-400"
            />
          </div>
        )}

        <h4 className="text-sm font-semibold text-amber-400 mb-2">Escolha o barbeiro:</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="barbeiro"
              value=""
              checked={barbeiroId === null}
              onChange={() => setBarbeiroId(null)}
            />
            <span className="text-gray-800">Sem preferência</span>
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
                <img src={url} alt={b.nome} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-gray-800">{b.nome}</span>
              </label>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-lg font-semibold text-gray-800">
            Total: {carrinho.reduce((soma, s) => soma + (s.preco || 0), 0)} MZN
          </p>

          <div className="flex gap-3 items-center">
            <button
              onClick={fecharModal}
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            >
              Fechar
            </button>

            <button
              onClick={salvarServicos}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
              disabled={carrinho.length === 0 || telefoneConfirmado.length < 9}
            >
              Submeter ({carrinho.length} itens)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
