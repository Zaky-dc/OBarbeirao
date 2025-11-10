import { useEffect, useState } from "react";
import axios from "axios";
import CardFila from "../components/CardFila";

export default function Fila() {
  const [checkins, setCheckins] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);

  // Buscar fila de clientes
  useEffect(() => {
  axios.get("http://localhost:3000/checkin/fila-presencial")
    .then(res => {
      console.log("Checkins recebidos:", res.data);
     setCheckins(res.data.dados)
    })
    .catch(err => console.error("Erro ao buscar checkins:", err));
}, []);

  // Buscar barbeiros disponíveis
  useEffect(() => {
    axios.get("http://localhost:3000/barbeiros")
      .then(res => setBarbeiros(res.data))
      .catch(err => console.error("Erro ao buscar barbeiros:", err));
  }, []);

  // Remover cliente da fila após atendimento
  const removerDaFila = (id) => {
    setCheckins(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fila de Clientes</h1>
      {checkins.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">Nenhum cliente na fila.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkins.map((cliente) => (
            <CardFila
              key={cliente._id}
              cliente={cliente}
              servicosIniciais={cliente.servicos}
              barbeiros={barbeiros}
              onAtendimentoFinalizado={removerDaFila}
            />
          ))}
        </div>
      )}
    </div>
  );
}