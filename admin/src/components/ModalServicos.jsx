import { useState } from "react";
import Catalogo from "./Catalogo";
import axios from "axios";

export default function ModalServicos({
  checkin,
  fecharModal,
  onServicosSalvos,
  BASE_URL,
}) {
  const [carrinho, setCarrinho] = useState([]);

  const salvarServicosEAtender = async () => {
    if (carrinho.length === 0) {
      alert("Selecione pelo menos um serviço antes de atender.");
      return;
    }

    const servicosCompletos = carrinho.map((s) => ({
      nome: s.nome,
      preco: s.preco,
      imageUrl: s.imageUrl,
    }));

    try {
      // 1. Salva os serviços no check-in
      await axios.patch(`${BASE_URL}/checkin/${checkin._id}/servicos`, {
        servicos: servicosCompletos,
      });

      // 2. Chama o callback para marcar como atendido
      onServicosSalvos();

      // 3. Fecha o modal
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar serviços:", error);
      alert("Erro ao salvar serviços. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Selecione os Serviços para: <span className="text-amber-600">{checkin.nome}</span>
        </h2>

        <div className="flex-grow overflow-y-auto mb-4">
          <Catalogo carrinho={carrinho} setCarrinho={setCarrinho} />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-lg font-semibold text-gray-800">
            Total: {carrinho.reduce((soma, s) => soma + (s.preco || 0), 0)} MZN
          </p>

          <div className="flex gap-3">
            <button
              onClick={fecharModal}
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={salvarServicosEAtender}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={carrinho.length === 0}
            >
              Salvar Serviços e Atender ({carrinho.length} Itens)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

