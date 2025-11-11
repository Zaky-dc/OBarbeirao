import { useEffect, useState } from "react";
import axios from "axios";

export default function PainelBarbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [form, setForm] = useState({ nome: "", contacto: "", taxaComissao: 0.3 });
  const [editandoId, setEditandoId] = useState(null);
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    carregarBarbeiros();
  }, []);

  const carregarBarbeiros = () => {
    axios.get(`${BASE_URL}/barbeiros`)
      .then(res => setBarbeiros(res.data))
      .catch(err => console.error("Erro ao carregar barbeiros:", err));
  };

  const salvar = () => {
  const url = editandoId
    ? `${BASE_URL}/barbeiros/${editandoId}` // ✅ corrigido
    : `${BASE_URL}/barbeiros`;

  const metodo = editandoId ? "put" : "post";

  axios[metodo](url, form)
    .then(() => {
      setForm({ nome: "", contacto: "", taxaComissao: 0.3 });
      setEditandoId(null);
      carregarBarbeiros();
    })
    .catch(err => console.error("Erro ao salvar barbeiro:", err));
};

  const editar = (b) => {
    setForm({
      nome: b.nome,
      contacto: b.contacto,
      taxaComissao: b.taxaComissao,
    });
    setEditandoId(b._id);
  };

  const excluir = (id) => {
    if (confirm("Deseja realmente excluir este barbeiro?")) {
      axios.delete(`${BASE_URL}/barbeiros/${id}`)
        .then(() => carregarBarbeiros())
        .catch(err => console.error("Erro ao excluir barbeiro:", err));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestão de Barbeiros</h1>

      <div className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-semibold">Adicionar ou Editar Barbeiro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Contacto"
          value={form.contacto}
          onChange={(e) => setForm({ ...form, contacto: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          placeholder="Taxa de Comissão (ex: 0.3)"
          value={form.taxaComissao}
          onChange={(e) => setForm({ ...form, taxaComissao: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={salvar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editandoId ? "Atualizar" : "Cadastrar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbeiros.map((b) => (
          <div key={b._id} className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{b.nome}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Contacto: {b.contacto}</p>
            <p className="text-sm text-amber-600 font-semibold">Comissão: {(b.taxaComissao * 100).toFixed(1)}%</p>
            <div className="flex gap-2">
              <button onClick={() => editar(b)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Editar</button>
              <button onClick={() => excluir(b._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}