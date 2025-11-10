import React from "react";
import Catalogo from "../components/Catalogo";
import { Scissors } from "lucide-react";

export default function PainelAdmin({ carrinho, setCarrinho }) {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-12">
        
        {/* Cabeçalho institucional */}
        <header className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 border-2 border-indigo-500 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-indigo-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-500 tracking-wide">
              Catálogo de Serviços
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Selecione os serviços desejados para montar o atendimento do cliente. Os itens escolhidos vão direto para o carrinho.
          </p>
        </header>

        {/* Catálogo */}
        <section className="grid gap-6">
          <Catalogo carrinho={carrinho} setCarrinho={setCarrinho} />
        </section>
      </div>
    </div>
  );
}
