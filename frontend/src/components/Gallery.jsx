import { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
  const [fotos, setFotos] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

   const BASE_URL = import.meta.env.VITE_API_URL || "https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    axios.get(`${BASE_URL}/galeria`)
      .then(res => setFotos(res.data))
      .catch(err => console.error("Erro ao carregar galeria:", err));
  }, []);

  return (
    <section id="galeria" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Título da seção */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-600 tracking-wider">
          GALERIA
        </h2>

        {/* Grid com as imagens */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {fotos.map((foto, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden group cursor-pointer"
              onClick={() => setImagemSelecionada(foto.url)}
            >
              <img
                src={foto.url}
                alt={`Galeria ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Modal para visualizar imagem completa */}
        {imagemSelecionada && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setImagemSelecionada(null)}
          >
            <div className="max-w-4xl w-full mx-4 relative">
              <img
                src={imagemSelecionada}
                alt="Imagem selecionada"
                className="w-full h-auto rounded shadow-lg"
              />
              <button
                onClick={() => setImagemSelecionada(null)}
                className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                ✕ Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}