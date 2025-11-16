import { useEffect, useState } from "react";
import axios from "axios";

export default function ExtratoFinanceiro() {
  const [pagamentos, setPagamentos] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState("");

 const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    axios.get(`${BASE_URL}/pagamentos`)
      .then((res) => setPagamentos(res.data))
      .catch((err) => console.error("Erro ao buscar extrato:", err));
  }, []);

  const filtrados = pagamentos.filter((p) =>
    mesSelecionado ? p.periodo.inicio?.startsWith(mesSelecionado) : true
  );

  const totalBruto = filtrados.reduce((acc, p) => acc + (p.totalBruto || 0), 0);
  const totalComissao = filtrados.reduce((acc, p) =>
    acc + (p.barbeiros?.reduce((s, b) => s + (b.valor || 0), 0) || 0), 0);
  const totalAdmin = filtrados.reduce((acc, p) => acc + (p.admin?.valor || 0), 0);
  const totalDespesas = filtrados.reduce((acc, p) =>
    acc + (p.despesas?.reduce((s, d) => s + (d.valor || 0), 0) || 0), 0);
  const totalLiquido = totalBruto - totalComissao - totalAdmin - totalDespesas;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-600">Extrato Financeiro</h2>

      {/* Filtro por mês */}
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-slate-600">Filtrar por mês:</label>
        <input
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </div>

      {/* Totais */}
      <div className="text-sm space-y-1 text-slate-700 dark:text-slate-300 pt-4">
        <p>Total bruto: {totalBruto} MZN</p>
        <p>Comissões barbeiros: {totalComissao} MZN</p>
        <p>Salário admin: {totalAdmin} MZN</p>
        <p>Despesas: {totalDespesas} MZN</p>
        <p className="font-semibold">Lucro líquido: {totalLiquido} MZN</p>
      </div>

      {/* Lista de pagamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {filtrados.map((p) => (
          <div key={p._id} className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {p.tipo === "semanal" ? "Pagamento Semanal" : "Pagamento Mensal"}
            </h3>
            <p className="text-sm text-slate-500">
              Período: {p.periodo.inicio} a {p.periodo.fim}
            </p>
            <p className="text-sm text-slate-500">Total bruto: {p.totalBruto} MZN</p>
            <p className="text-sm text-green-600">Liquidez: {p.totalLiquido} MZN</p>

            {/* Barbeiros */}
            {p.barbeiros?.length > 0 && (
              <div className="text-sm text-slate-600">
                <p className="font-semibold mt-2">Barbeiros:</p>
                <ul>
                  {p.barbeiros.map((b, i) => (
                    <li key={i}>
                      • {b.nome}: {b.valor} MZN {b.pago && "✅"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Despesas */}
            {p.despesas?.length > 0 && (
              <div className="text-sm text-slate-600">
                <p className="font-semibold mt-2">Despesas:</p>
                <ul>
                  {p.despesas.map((d, i) => (
                    <li key={i}>
                      • {d.tipo}: {d.valor} MZN {d.observacao && `(${d.observacao})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Admin */}
            {p.admin?.valor && (
              <p className="text-sm text-blue-600 mt-2">
                Admin: {p.admin.valor} MZN {p.admin.pago && "✅"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
