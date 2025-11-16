import { useEffect, useState } from "react";
import axios from "axios";

export default function FechamentoMensal() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({
    tipo: "",
    valor: "",
    recibo: "",
    observacao: "",
  });
  const [mesAtual, setMesAtual] = useState("");
  const [assumirSemanais, setAssumirSemanais] = useState(false);

  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    const hoje = new Date();
    const mes = hoje.toISOString().slice(0, 7); // "2025-11"
    setMesAtual(mes);

    axios.get(`${BASE_URL}/atendimentos`)
      .then((res) => {
        const filtrados = res.data.filter((a) => a.data?.startsWith(mes));
        setAtendimentos(filtrados);
      })
      .catch((err) => console.error("Erro ao buscar atendimentos:", err));

    axios.get(`${BASE_URL}/pagamentos`)
      .then((res) => setPagamentos(res.data))
      .catch((err) => console.error("Erro ao buscar pagamentos:", err));
  }, []);

  // Receita bruta do mês
  const totalBruto = atendimentos.reduce((acc, a) => {
    const subtotal = a.servicos.reduce((s, serv) => s + serv.preco, 0);
    return acc + subtotal;
  }, 0);

  // Pagamentos semanais do mês
  const semanais = pagamentos.filter(
    (p) => p.tipo === "semanal" && p.periodo.inicio.startsWith(mesAtual)
  );

  const jaPagoSemanal = semanais.reduce(
    (acc, p) => acc + p.barbeiros.reduce((s, b) => s + (b.pago ? b.valor : 0), 0),
    0
  );

  const faltavaSemanal = semanais.reduce(
    (acc, p) => acc + p.barbeiros.reduce((s, b) => s + (!b.pago ? b.valor : 0), 0),
    0
  );

  const comissaoBarbeiros = assumirSemanais
    ? jaPagoSemanal + faltavaSemanal
    : jaPagoSemanal;

  const salarioAdmin = totalBruto * 0.15;

  const totalDespesas = despesas.reduce(
    (acc, d) => acc + Number(d.valor || 0),
    0
  );

  const totalLiquido = totalBruto - comissaoBarbeiros - salarioAdmin - totalDespesas;

  const registrarPagamentoMensal = async () => {
    try {
      const payload = {
        tipo: "mensal",
        periodo: {
          inicio: `${mesAtual}-01`,
          fim: `${mesAtual}-31`,
        },
        barbeiros: semanais.flatMap((p) =>
          p.barbeiros.map((b) => ({
            barbeiroId: b.barbeiroId,
            nome: b.nome,
            valorTotalMes: b.valor,
            jaPagoSemanal: b.pago ? b.valor : 0,
            faltava: !b.pago ? b.valor : 0,
            pago: true, // ✅ assume todos como pagos
          }))
        ),
        despesas,
        admin: {
          valor: salarioAdmin,
          pago: true,
          dataPagamento: new Date(),
        },
        totalBruto,
        totalLiquido,
      };

      await axios.post(`${BASE_URL}/pagamentos`, payload);
      const atualizados = await axios.get(`${BASE_URL}/pagamentos`);
      setPagamentos(atualizados.data);
    } catch (err) {
      console.error("Erro ao registrar pagamento mensal:", err);
    }
  };

  const adicionarDespesa = () => {
    if (!novaDespesa.tipo || !novaDespesa.valor || !novaDespesa.recibo) return;
    setDespesas((prev) => [...prev, novaDespesa]);
    setNovaDespesa({ tipo: "", valor: "", recibo: "", observacao: "" });
  };

  const jaFoiPago = pagamentos.some(
    (p) => p.tipo === "mensal" && p.periodo.inicio.startsWith(mesAtual)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-600">
        Fechamento Mensal ({mesAtual})
      </h2>

      {jaFoiPago ? (
        <p className="text-green-600 font-semibold">
          ✅ Pagamento mensal já registrado.
        </p>
      ) : (
        <>
          <div className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
            <p>Total bruto: {totalBruto} MZN</p>
            <p>Já pago semanal: {jaPagoSemanal} MZN</p>
            <p>Faltava semanal: {faltavaSemanal} MZN</p>
            <p>
              Comissão barbeiros: {comissaoBarbeiros} MZN{" "}
              {!assumirSemanais && "(parcial)"}
            </p>
            <p>Salário admin (15%): {salarioAdmin} MZN</p>
            <p>Despesas: {totalDespesas} MZN</p>
            <p className="font-semibold">Total líquido: {totalLiquido} MZN</p>
          </div>

          {/* Botão para assumir semanais como pagos */}
          {faltavaSemanal > 0 && (
            <button
              onClick={() => setAssumirSemanais(true)}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Assumir semanais como pagos
            </button>
          )}

          {/* Despesas */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-600">
              Registrar despesas:
            </h3>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Tipo (água, luz...)"
                value={novaDespesa.tipo}
                onChange={(e) =>
                  setNovaDespesa({ ...novaDespesa, tipo: e.target.value })
                }
                className="px-2 py-1 border rounded"
              />
              <input
                type="number"
                placeholder="Valor"
                value={novaDespesa.valor}
                onChange={(e) =>
                  setNovaDespesa({ ...novaDespesa, valor: e.target.value })
                }
                className="px-2 py-1 border rounded"
              />
              <input
                type="text"
                placeholder="Nº Recibo"
                value={novaDespesa.recibo}
                onChange={(e) =>
                  setNovaDespesa({ ...novaDespesa, recibo: e.target.value })
                }
                className="px-2 py-1 border rounded"
              />
              <input
                type="text"
                placeholder="Observação (opcional)"
                value={novaDespesa.observacao}
                onChange={(e) =>
                  setNovaDespesa({ ...novaDespesa, observacao: e.target.value })
                }
                className="px-2 py-1 border rounded"
              />
              <button
                onClick={adicionarDespesa}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>

            {despesas.length > 0 && (
              <ul className="text-sm mt-2">
                {despesas.map((d, i) => (
                  <li key={i}>
                    • {d.tipo}: {d.valor} MZN (Recibo: {d.recibo})
                    {d.observacao && ` — ${d.observacao}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Botão de registrar pagamento */}
          <button
            onClick={registrarPagamentoMensal}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Confirmar pagamento mensal
          </button>
        </>
      )}
    </div>
  );
}