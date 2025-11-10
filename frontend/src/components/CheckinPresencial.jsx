import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { showToast } from "../components/toastManager";
import ModalServicosCliente from "../components/ModalServicosCliente";
import { useNavigate } from "react-router-dom";

export default function CheckinPresencial() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fila, setFila] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [checkinSelecionado, setCheckinSelecionado] = useState(null);
  const navigate = useNavigate();

  const CHECKIN_URL = "https://o-barbeirao.vercel.app";
  const BASE_URL = "https://o-barbeirao-back.vercel.app/api";
  const url = `${CHECKIN_URL}/checkin-presencial`;

  const buscarFila = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/checkin/fila-presencial`);
      setFila(res.data.dados);
    } catch (err) {
      console.error("Erro ao buscar fila:", err);
    }
  };

  useEffect(() => {
    buscarFila();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/checkin/checkin-presencial`, {
        nome,
        telefone,
      });
      showToast("Você entrou na fila com sucesso!", "sucesso");
      setNome("");
      setTelefone("");
      buscarFila(); // atualiza a fila após check-in
    } catch (err) {
      console.error("Erro ao registrar check-in:", err);
      showToast("Falha ao registrar check-in.", "erro");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 pt-28">
      <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">
        Check-in Presencial
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md space-y-4"
        >
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-zinc-700 text-white placeholder-gray-400"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-zinc-700 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold py-2 rounded transition"
          >
            Entrar na fila
          </button>
        </form>

        {/* QR Code */}
        <div className="bg-white p-4 rounded shadow-lg">
          <QRCode value={url} size={180} fgColor="#000000" />
          <p className="mt-2 text-sm text-gray-700 text-center max-w-[180px]">
            Escaneie com seu celular para abrir esta página.
          </p>
        </div>
      </div>

      {/* Fila do dia */}
      <div className="mt-12 w-full max-w-2xl bg-zinc-800 p-6 rounded shadow-lg">
        <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">
          Fila presencial de hoje
        </h3>
        {fila.length === 0 ? (
          <p className="text-gray-400 text-center">
            Nenhum cliente na fila ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {fila.map((item, index) => (
              <li
                key={item._id}
                className="bg-zinc-700 p-3 rounded flex justify-between items-center"
              >
                <span className="text-white font-medium">
                  {index + 1}. {item.nome}
                </span>
                <div className="flex flex-col items-end gap-1 text-sm mt-2">
                  {/* Botões de ação */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/meus-agendamentos")}
                      className="text-red-400 underline hover:text-red-300"
                    >
                      Cancelar
                    </button>

                    {item.servicos && item.servicos.length > 0 ? (
                      <button
                        onClick={() => {
                          setCheckinSelecionado({
                            ...item,
                            forcarEdicao: true,
                          });
                          setModalAberto(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 20h4l10.5-10.5-4-4L4 16v4z" />
                        </svg>
                        Editar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCheckinSelecionado(item);
                          setModalAberto(true);
                        }}
                        className="text-amber-400 underline hover:text-amber-300"
                      >
                        Escolher serviços
                      </button>
                    )}
                  </div>

                  {/* Serviços escolhidos */}
                  {item.servicos && item.servicos.length > 0 && (
                    <p className="text-amber-400 font-medium text-right">
                      Serviços: {item.servicos.map((s) => s.nome).join(", ")}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {modalAberto && checkinSelecionado && (
          <ModalServicosCliente
            checkin={checkinSelecionado}
            fecharModal={() => {
              setModalAberto(false);
              setCheckinSelecionado(null);
              buscarFila(); // atualiza após edição
            }}
            BASE_URL={BASE_URL}
          />
        )}
      </div>
    </div>
  );
}
