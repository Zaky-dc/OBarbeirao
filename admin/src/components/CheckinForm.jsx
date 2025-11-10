import React from "react";
import axios from "axios";

export default function CheckinForm({
  nomeCliente,
  setNomeCliente,
  telefone,
  setTelefone,
  carrinho,
  setCarrinho,
}) {
  async function enviarCheckin(e) {
    e.preventDefault();

    if (!nomeCliente || !telefone || carrinho.length === 0) {
      alert("Preencha todos os campos e selecione ao menos um serviço.");
      return;
    }

    const payload = {
      nome: nomeCliente,
      telefone,
      servicos: carrinho.map((s) => ({
        nome: s.nome,
        preco: s.preco,
        imageUrl: s.imageUrl,
      })),
    };

    try {
      const res = await axios.post("http://localhost:3000/checkin", payload);
      console.log("Check-in registrado:", res.data);
      alert("Check-in confirmado com sucesso!");
      setNomeCliente("");
      setTelefone("");
      setCarrinho([]);
    } catch (err) {
      console.error("Erro ao registrar check-in:", err);
      alert("Erro ao registrar check-in. Tente novamente.");
    }
  }

  return (
    <form
      onSubmit={enviarCheckin}
      className="bg-white p-6 rounded-md shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        📋 Formulário de Check-in
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Nome do Cliente
        </label>
        <input
          type="text"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Ex: João Macamo"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Ex: 84 123 4567"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Confirmar Check-in
      </button>
    </form>
  );
}
