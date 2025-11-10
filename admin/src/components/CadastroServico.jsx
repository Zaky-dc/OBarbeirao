import { useState } from "react";
import axios from "axios";

export default function CadastroServico() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  const handleSelecionar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const salvarServico = async () => {
    if (!nome || !preco || !imagem) return;

    setEnviando(true);

    try {
      // 1. Envia imagem para Cloudinary
      const formData = new FormData();
      formData.append("file", imagem);
      formData.append("upload_preset", UPLOAD_PRESET);

      const resUpload = await axios.post(CLOUDINARY_URL, formData);
      console.log("URL da imagem:", resUpload.data.secure_url);
      const imageUrl = resUpload.data.secure_url;

      // 2. Salva no MongoDB
      await axios.post(`${BASE_URL}/servicos`, {
        nome,
        preco: Number(preco),
        imageUrl,
      });

      alert("Serviço cadastrado com sucesso!");
      setNome("");
      setPreco("");
      setImagem(null);
      setPreview(null);
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      alert("Erro ao salvar serviço.");
    } finally {
      setEnviando(false);
    }
  };

  return (
   <div className="max-w-md ml-4 md:ml-12 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cadastrar novo serviço</h2>

      <input
        type="text"
        placeholder="Nome do serviço"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="number"
        placeholder="Preço (MZN)"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleSelecionar}
        className="mb-3 "
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-48 h-48 object-cover rounded shadow mb-3"
        />
      )}

      <button
        onClick={salvarServico}
        disabled={!nome || !preco || !imagem || enviando}
        className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Salvar serviço"}
      </button>
    </div>
  );
}
