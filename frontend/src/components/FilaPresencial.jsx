import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";


export default function FilaPresencial() {
  const [fila, setFila] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_URL;
  

  useEffect(() => {
    const carregarFila = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/checkin/fila-presencial`);
        setFila(res.data.dados);
      } catch (err) {
        console.error("Erro ao carregar fila:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregarFila();
    const intervalo = setInterval(carregarFila, 10000); // atualiza a cada 10s
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 pt-28">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">
          🧍‍♂️ Fila Presencial
        </h2>

        {carregando ? (
          <div className="flex justify-center items-center mt-12">
            <Loader2 className="animate-spin w-6 h-6 text-amber-500" />
          </div>
        ) : fila.length === 0 ? (
          <p className="text-center text-gray-400">Nenhum cliente na fila no momento.</p>
        ) : (
          <ul className="space-y-4">
            {fila.map((pessoa, index) => (
              <li
                key={pessoa._id}
                className="bg-zinc-800 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-amber-400">{pessoa.nome}</p>
                  <p className="text-sm text-gray-400">
                    Entrou às {new Date(pessoa.horario).toLocaleTimeString("pt-MZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
