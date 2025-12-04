import { useEffect, useState } from "react";
import axios from "axios";

export default function FechamentoSemanal() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [semanaAtual, setSemanaAtual] = useState({ inicio: "", fim: "" });

  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";
  const TAXA_FIXA = 0.3;

  useEffect(() => {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - diaSemana);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);

    const inicioStr = inicio.toISOString().slice(0, 10);
    const fimStr = fim.toISOString().slice(0, 10);

    setSemanaAtual({ inicio: inicioStr, fim: fimStr });

    axios.get(`${BASE_URL}/atendimentos`)
      .then((res) => {
        const filtrados = res.data.filter((a) => {
          const dataStr = new Date(a.data).toISOString().slice(0, 10);
          return dataStr >= inicioStr && dataStr <= fimStr;
        });
        setAtendimentos(filtrados);
      })
      .catch((err) => console.error("Erro ao buscar atendimentos:", err));

    axios.get(`${BASE_URL}/pagamentos`)
      .then((res) => setPagamentos(res.data))
      .catch((err) => console.error("Erro ao buscar pagamentos:", err));
  }, []);

  const isPago = (atendimentoId) => {
    return pagamentos.some(
      (p) =>
        p.tipo === "semanal" &&
        p.periodo.inicio.slice(0, 10) === semanaAtual.inicio &&
        p.periodo.fim.slice(0, 10) === semanaAtual.fim &&
        p.barbeiros.some((b) =>
          b.atendimentoId === atendimentoId && b.pago
        )
    );
  };

  const confirmarPagamento = async (atendimento) => {
    try {
      const pagamentoExistente = pagamentos.find(
        (p) =>
          p.tipo === "semanal" &&
          p.periodo.inicio.slice(0, 10) === semanaAtual.inicio &&
          p.periodo.fim.slice(0, 10) === semanaAtual.fim
      );

      const dadosBarbeiro = {
       barbeiroId: atendimento.barbeiro._id,
        nome: atendimento.barbeiro.nome,
        valorTotalMes: atendimento.valorTotal * TAXA_FIXA, 
        pago: true,
        dataPagamento: new Date(),
        atendimentoId: atendimento._id,
      };

      if (pagamentoExistente) {
        const jaExiste = pagamentoExistente.barbeiros.some(
          (b) => b.atendimentoId === atendimento._id
        );

        if (jaExiste) {
          const res = await axios.patch(
            `${BASE_URL}/pagamentos/${pagamentoExistente._id}/barbeiro/${atendimento.barbeiro._id}`,
            { pago: true, dataPagamento: new Date(), atendimentoId: atendimento._id }
          );

          // ✅ Atualiza estado local imediatamente
          setPagamentos((prev) =>
            prev.map((p) => (p._id === res.data._id ? res.data : p))
          );
        } else {
          const novosBarbeiros = [...pagamentoExistente.barbeiros, dadosBarbeiro];
          const novoTotalBruto = novosBarbeiros.reduce((acc, b) => acc + b.valor / TAXA_FIXA, 0);
          const novoTotalLiquido = novosBarbeiros.reduce((acc, b) => acc + b.valor, 0);

          const res = await axios.put(`${BASE_URL}/pagamentos/${pagamentoExistente._id}`, {
            ...pagamentoExistente,
            barbeiros: novosBarbeiros,
            totalBruto: novoTotalBruto,
            totalLiquido: novoTotalLiquido,
          });

          setPagamentos((prev) =>
            prev.map((p) => (p._id === res.data._id ? res.data : p))
          );
        }
      } else {
        const novo = {
          tipo: "semanal",
          periodo: semanaAtual,
          barbeiros: [dadosBarbeiro],
          totalBruto: atendimento.valorTotal,
          totalLiquido: dadosBarbeiro.valorTotalMes,
        };
        const res = await axios.post(`${BASE_URL}/pagamentos`, novo);

        setPagamentos((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Erro ao confirmar pagamento:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-600">
        Fechamento Semanal ({semanaAtual.inicio} a {semanaAtual.fim})
      </h2>

      {atendimentos.length === 0 ? (
        <p className="text-slate-500 italic">Nenhum atendimento nesta semana.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {atendimentos.map((a) => {
            const pago = isPago(a._id);
            const comissao = a.valorTotal * TAXA_FIXA;

            return (
              <div
                key={a._id}
                className={`p-4 rounded shadow space-y-2 transition-colors ${
                  pago
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-white dark:bg-slate-800"
                }`}
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {a.barbeiro.nome}
                </h3>
                <p className="text-sm text-slate-500">Cliente: {a.cliente.nome}</p>
                <p className="text-sm text-slate-500">
                  Serviços: {a.servicos.map((s) => s.nome).join(", ")}
                </p>
                <p className="text-sm text-slate-500">
                  Total bruto: {a.valorTotal.toFixed(2)} MZN
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  Comissão (30%): {comissao.toFixed(2)} MZN
                </p>

                {pago ? (
                  <button
                    disabled
                    className="bg-red-400 text-white px-3 py-1 rounded cursor-not-allowed"
                  >
                    Pagamento confirmado
                  </button>
                ) : (
                  <button
                    onClick={() => confirmarPagamento(a)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Confirmar pagamento
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
