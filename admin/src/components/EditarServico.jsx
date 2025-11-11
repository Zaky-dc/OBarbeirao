import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditarServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";
  const CLOUDINARY_URL ="https://api.cloudinary.com/v1_1/dxuvpkfbn/image/upload";
  const UPLOAD_PRESET ="whpm5cwd";

  const [servico, setServico] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/servicos`).then((res) => {
     // const encontrado = res.data.find((s) => s._id === id);
     const encontrado = res.data.servicos.find((s) => s._id === id);
      if (encontrado) {
        setServico(encontrado);
        setPreview(encontrado.imageUrl);
      }
      setCarregando(false);
    });
  }, [id]);

  const handleSelecionar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const salvarEdicao = async () => {
    let imageUrl = preview;

    if (imagem) {
      const formData = new FormData();
      formData.append("file", imagem);
      formData.append("upload_preset", UPLOAD_PRESET);
      const resUpload = await axios.post(CLOUDINARY_URL, formData);
      imageUrl = resUpload.data.secure_url;
    }

    await axios.put(`${BASE_URL}/servicos/${id}`, {
      nome: servico.nome,
      preco: Number(servico.preco),
      imageUrl,
    });

    alert("Serviço atualizado com sucesso!");
    navigate("/servicos");
  };

  if (carregando || !servico)
    return <p className="p-4">Carregando serviço...</p>;

  return (
    <div className="max-w-xl px-4 md:px-12 lg:px-20 xl:px-32 py-6 bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-700 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Editar Serviço
      </h2>

      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Nome
      </label>
      <input
        type="text"
        value={servico.nome}
        onChange={(e) => setServico({ ...servico, nome: e.target.value })}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
      />

      <input
        type="number"
        value={servico.preco}
        onChange={(e) => setServico({ ...servico, preco: e.target.value })}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleSelecionar}
        className="mb-3"
      />

      {preview && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Pré-visualização:
          </p>
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded shadow"
          />
        </div>
      )}

      <button
        onClick={salvarEdicao}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition-all"
      >
        Salvar alterações
      </button>
    </div>
  );
}
