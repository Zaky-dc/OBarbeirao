import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ListaServicos() {
  const [servicos, setServicos] = useState([]);
  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

 useEffect(() => {
  axios
    .get(`${BASE_URL}/servicos`)
    .then((res) => {
      console.log("Resposta da API:", res.data);
      setServicos(res.data.dados || []); // usa .dados se for o formato do backend
    })
    .catch((err) => {
      console.error("Erro ao buscar serviços:", err);
      setServicos([]); // evita erro de map em caso de falha
    });
}, []);


  const apagarServico = async (id) => {
    if (!confirm("Deseja realmente apagar este serviço?")) return;
    await axios.delete(`${BASE_URL}/servicos/${id}`);
    setServicos(servicos.filter((s) => s._id !== id));
  };

  return (
    <div className="max-w-5xl px-4 md:px-12 lg:px-20 xl:px-32 py-6 space-y-6">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white border-b pb-2">
        Serviços cadastrados
      </h2>
      <div className="grid gap-4">
        {servicos.map((s) => (
          <div
            key={s._id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <img
                src={s.imageUrl}
                alt={s.nome}
                className="w-24 h-24 object-cover rounded-lg ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {s.nome}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {s.preco} MZN
                </p>
              </div>
            </div>

            <div className="flex gap-2 self-end md:self-auto">
              <Link
                to={`/editar-servico/${s._id}`}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
              >
                Editar
              </Link>
              <button
                onClick={() => apagarServico(s._id)}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded transition-all"
              >
                Apagar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
