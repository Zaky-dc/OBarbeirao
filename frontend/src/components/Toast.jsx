import { useEffect, useState } from "react";

export default function Toast({ mensagem, tipo = "sucesso", onClose }) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(false);
      setTimeout(onClose, 300); // espera animação terminar
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const cores = {
    sucesso: "bg-green-600",
    erro: "bg-red-600",
    info: "bg-amber-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded shadow-lg text-white transition-all duration-300 ${
        visivel ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      } ${cores[tipo]}`}
    >
      {mensagem}
    </div>
  );
}
