import { useState } from "react";

export default function Gallery() {
  // Estado para armazenar a imagem selecionada (opcional)
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  // Array com as imagens da galeria
  const imagens = [
    "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://i.pinimg.com/1200x/c8/a3/83/c8a383518c80647b730fb61ef37d9ce2.jpg",
    "https://i.pinimg.com/1200x/01/f4/2d/01f42dd792f1c66512cc3e251fe1d725.jpg",
    "https://i.pinimg.com/1200x/97/bf/2d/97bf2dae60b10996d45a18f715802155.jpg",
    "https://i.pinimg.com/736x/4a/4d/c3/4a4dc3196a8c7f4758333a2286257720.jpg",
    "https://i.pinimg.com/1200x/8d/e3/be/8de3be80d0014a883087d6a1bca74cb9.jpg",
  ];

  return (
    <section id="galeria" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Título da seção */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-600 tracking-wider">
          GALERIA
        </h2>

        {/* Grid com as imagens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {imagens.map((imagem, indice) => (
            <div
              key={indice}
              className="aspect-square overflow-hidden group cursor-pointer"
              onClick={() => setImagemSelecionada(imagem)}
            >
              {/* Imagem da galeria */}
              <img
                src={imagem}
                alt={`Galeria ${indice + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Modal para visualizar imagem completa (opcional) */}
        {imagemSelecionada && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setImagemSelecionada(null)}
          >
            <div className="max-w-3xl w-full mx-4">
              <img
                src={imagemSelecionada}
                alt="Imagem selecionada"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
