import { Scissors, User, Sparkles } from "lucide-react";
import { GiBeard } from "react-icons/gi";
import { PiSprayBottleBold } from "react-icons/pi";
export default function Services() {
  // Array com os serviços da barbearia
  const servicos = [
    {
      icone: Scissors,
      titulo: "CORTES",
      descricao: "Cortes modernos e clássicos",
    },
    {
      icone: GiBeard,
      titulo: "BARBA",
      descricao: "Design e tratamento de barba",
    },
    {
      icone: PiSprayBottleBold,
      titulo: "TRATAMENTOS",
      descricao: "Cuidados especiais para cabelo e barba",
    },
  ];

  return (
    <section id="servicos" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Título da seção */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-600 tracking-wider">
          SERVIÇOS
        </h2>

        {/* Grid com os serviços */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {servicos.map((servico, indice) => {
            // Pega o componente de ícone
            const IconeServico = servico.icone;

            return (
              <div
                key={indice}
                className="border border-amber-600/30 p-8 text-center hover:border-amber-600 transition-all hover:bg-amber-600/5 group"
              >
                {/* Ícone do serviço */}
                <div className="flex justify-center mb-6">
                  <IconeServico
                    className="w-16 h-16 text-amber-600 group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Título do serviço */}
                <h3 className="text-xl font-bold text-amber-600 mb-3 tracking-wide">
                  {servico.titulo}
                </h3>

                {/* Descrição do serviço */}
                <p className="text-gray-400 text-sm">{servico.descricao}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
