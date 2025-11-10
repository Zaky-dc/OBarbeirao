import React from "react";

export default function Carrinho({ carrinho, setCarrinho }) {
  function removerServico(id) {
    const atualizado = carrinho.filter((s) => s._id !== id);
    setCarrinho(atualizado);
    console.log("Removido do carrinho:", id);
  }

  const total = carrinho.reduce((acc, s) => acc + s.preco, 0);

  return (
    <div>

      {carrinho.length === 0 ? (
        <p className="text-gray-500">Nenhum serviço selecionado.</p>
      ) : (
        <ul className="space-y-4">
          {carrinho.map((servico) => (
            <li
              key={servico._id}
              className="flex items-center justify-between  p-4 rounded-md bg-white shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{servico.nome}</h3>
                <p className="text-sm text-gray-600">{servico.preco} MZN</p>
              </div>
              <button
                onClick={() => removerServico(servico._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      {carrinho.length > 0 && (
        <div className="mt-4 text-right font-bold text-gray-700">
          Total: {total} MZN
        </div>
      )}
    </div>
  );
}