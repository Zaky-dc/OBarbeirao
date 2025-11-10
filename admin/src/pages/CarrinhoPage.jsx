import React, { useState } from "react";
import Carrinho from "../components/Carrinho";
import CheckinForm from "../components/CheckinForm";

export default function CarrinhoPage({ carrinho, setCarrinho }) {
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const carrinhoVazio = carrinho.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-screen-md mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">🛒 Carrinho de Serviços</h1>

        <Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />

        {!carrinhoVazio && (
          <div className="text-right">
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Finalizar Check-in
            </button>
          </div>
        )}

        {carrinhoVazio && (
          <p className="text-gray-500 text-center italic">
            Nenhum serviço selecionado. Volte ao catálogo para adicionar.
          </p>
        )}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-stone-700/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <CheckinForm
              nomeCliente={nomeCliente}
              setNomeCliente={setNomeCliente}
              telefone={telefone}
              setTelefone={setTelefone}
              carrinho={carrinho}
              setCarrinho={setCarrinho}
            />
          </div>
        </div>
      )}
    </div>
  );
}