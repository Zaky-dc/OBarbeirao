import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Catalogo({ carrinho, setCarrinho }) {
  const [servicos, setServicos] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
   const BASE_URL =
    import.meta.env.VITE_API_URL || "https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/servicos`)
      .then((res) => {
        console.log("Serviços carregados:", res.data);
        setServicos(res.data);
      })
      .catch((err) => console.error("Erro ao carregar catálogo:", err));
  }, []);

  
  function adicionarAoCarrinho(servico) {
    const jaExiste = carrinho.find((s) => s._id === servico._id);
    if (!jaExiste) {
      setCarrinho([...carrinho, servico]);
    } else {
      console.log("Serviço já está no carrinho:", servico.nome);
    }
  }

  return (
    <section className="py-2 m-4">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {servicos.length === 0 && (
            <p className="text-gray-500">Carregando serviços...</p>
          )}
          {servicos.map((servico) => {
            const jaExiste = carrinho.find((s) => s._id === servico._id);

            return (
              <div
                key={servico._id}
                className="group rounded-lg shadow-md overflow-hidden flex flex-col md:aspect-square md:relative"
              >
                {/* Imagem */}
                <div className="w-full h-64 md:h-full">
                  <img
                    src={servico.imageUrl}
                    alt={servico.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onClick={() => setImagemSelecionada(servico.imageUrl)}
                  />
                </div>

                {/* Conteúdo visível no mobile, overlay no desktop */}
                <div className="p-4 md:absolute md:inset-0 md:bg-black/50 md:backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 md:flex md:flex-col md:justify-end">
                  <h3 className="text-lg font-semibold text-gray-800 md:text-white">
                    {servico.nome}
                  </h3>
                  <p className="text-sm text-gray-600 md:text-white mb-2">
                    Preço: {servico.preco} MZN
                  </p>
                  <button
                    onClick={() =>
                      jaExiste
                        ? setCarrinho(
                            carrinho.filter((s) => s._id !== servico._id)
                          )
                        : setCarrinho([...carrinho, servico])
                    }
                    className={`px-4 py-2 rounded transition ${
                      jaExiste
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {jaExiste ? "Remover" : "Adicionar"}
                  </button>
                </div>
              </div>
            );
          })}

          {imagemSelecionada && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="relative max-w-4xl w-full">
                <button
                  onClick={() => setImagemSelecionada(null)}
                  className="absolute top-4 right-4 text-white text-2xl hover:text-red-400"
                >
                  &times;
                </button>
                <img
                  src={imagemSelecionada}
                  alt="Imagem ampliada"
                  className="w-full h-auto rounded shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
