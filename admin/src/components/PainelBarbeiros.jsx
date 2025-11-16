import { useEffect, useState } from "react";
import axios from "axios";

export default function PainelBarbeiros() {
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxuvpkfbn/image/upload";
  const UPLOAD_PRESET = "whpm5cwd";

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";
  const [barbeiros, setBarbeiros] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    contacto: "",
    taxaComissao: 0.3,
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarBarbeiros();
  }, []);

  const handleSelecionarImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const enviarImagem = async () => {
    setCarregandoImagem(true);
    const formData = new FormData();
    formData.append("file", imagem);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(CLOUDINARY_URL, formData);
    setCarregandoImagem(false);
    return res.data.secure_url;
  };

  const carregarBarbeiros = () => {
    axios
      .get(`${BASE_URL}/barbeiros`)
      .then((res) => setBarbeiros(res.data))
      .catch((err) => console.error("Erro ao carregar barbeiros:", err));
  };

  const salvar = async () => {
    try {
      let imageUrl = "";

      if (imagem) {
        imageUrl = await enviarImagem();
      } else if (!editandoId) {
        alert("Selecione uma imagem para o barbeiro.");
        return;
      }

      const payload = {
        ...form,
        imageUrl,
      };

      const url = editandoId
        ? `${BASE_URL}/barbeiros/${editandoId}`
        : `${BASE_URL}/barbeiros`;

      const metodo = editandoId ? "put" : "post";

      await axios[metodo](url, payload);

      setForm({ nome: "", contacto: "", taxaComissao: 0.3 });
      setImagem(null);
      setPreview(null);
      setEditandoId(null);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 2000);
      carregarBarbeiros();
    } catch (err) {
      console.error("Erro ao salvar barbeiro:", err);
      alert("Erro ao salvar barbeiro.");
    }
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
      axios
        .delete(`${BASE_URL}/barbeiros/${id}`)
        .then(() => carregarBarbeiros())
        .catch((err) => console.error("Erro ao excluir barbeiro:", err));
    }
  };

  return (
     <div className="space-y-6">
    <div className="bg-white dark:bg-slate-800 p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        Adicionar ou Editar Barbeiro
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campos de texto */}
        <div className="md:col-span-2 space-y-3">
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
            onChange={(e) =>
              setForm({ ...form, taxaComissao: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Upload e preview */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleSelecionarImagem}
            className="w-full"
          />

          {carregandoImagem && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 aspect-square object-cover object-center rounded-full shadow transition-opacity duration-500 opacity-100"
            />
          )}
        </div>
      </div>

      {/* Botão e feedback */}
      <div className="flex items-center justify-between">
        <button
          onClick={salvar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editandoId ? "Atualizar" : "Cadastrar"}
        </button>

        {sucesso && (
          <span className="text-green-600 text-sm animate-pulse">
            Barbeiro salvo com sucesso!
          </span>
        )}
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbeiros.map((b) => {
          const urlComQualidade = b.imageUrl.replace(
            "/upload/",
            "/upload/q_auto,f_auto/"
          );

          return (
            <div
              key={b._id}
              className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-2"
            >
              <div className="flex justify-center mb-2">
                <img
                  src={urlComQualidade}
                  alt={b.nome}
                  className="w-36 aspect-square object-cover object-center rounded-full shadow"
                />
              </div>

              <h2 className="text-lg font-bold text-slate-800 dark:text-white text-center">
                {b.nome}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                Contacto: {b.contacto}
              </p>
              <p className="text-sm text-amber-600 font-semibold text-center">
                Comissão: {(b.taxaComissao * 100).toFixed(1)}%
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => editar(b)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluir(b._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
