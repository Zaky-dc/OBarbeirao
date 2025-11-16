import { useState, useEffect } from "react";
import axios from "axios";

export default function CarregarGaleria() {
  const [fotos, setFotos] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false); // estado de carregamento

  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  useEffect(() => {
    axios.get(`${BASE_URL}/galeria`)
      .then(res => setFotos(res.data))
      .catch(err => console.error("Erro ao carregar galeria:", err));
  }, []);

  const enviarFoto = async () => {
    if (!imagem) return;
    setLoading(true); // inicia animação

    try {
      // Upload para Cloudinary
      const formData = new FormData();
      formData.append("file", imagem);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const cloudinaryRes = await axios.post(CLOUDINARY_URL, formData);

      // Salvar no backend
      await axios.post(`${BASE_URL}/galeria`, {
        url: cloudinaryRes.data.secure_url,
      });

      // Atualizar lista
      const atualizadas = await axios.get(`${BASE_URL}/galeria`);
      setFotos(atualizadas.data);
      setImagem(null);
    } catch (err) {
      console.error("Erro ao enviar foto:", err);
    } finally {
      setLoading(false); // encerra animação
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-amber-600">Carregar Galeria</h2>

      {/* Formulário de upload */}
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="file"
          onChange={(e) => setImagem(e.target.files[0])}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={enviarFoto}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Carregando..." : "Upload"}
        </button>
      </div>

      {/* Spinner de carregamento */}
      {loading && (
        <div className="flex items-center gap-2 text-amber-600 font-semibold">
          <svg
            className="animate-spin h-5 w-5 text-amber-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Enviando imagem...</span>
        </div>
      )}

      {/* GridView das imagens */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {fotos.map((foto) => (
          <div
            key={foto._id}
            className="relative aspect-square overflow-hidden group"
          >
            <img
              src={foto.url}
              alt="foto"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Botão apagar visível só no hover */}
            <button
              onClick={() => {
                axios.delete(`${BASE_URL}/galeria/${foto._id}`)
                  .then(() => setFotos(fotos.filter((f) => f._id !== foto._id)))
                  .catch(err => console.error("Erro ao apagar foto:", err));
              }}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Apagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}