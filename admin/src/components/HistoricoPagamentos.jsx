import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function PainelAuditoriaPagamentos() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);

  const BASE_URL ="https://o-barbeirao-back.vercel.app/api";

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resBarbeiros, resPagamentos] = await Promise.all([
          axios.get(`${BASE_URL}/barbeiros`),
          axios.get(`${BASE_URL}/pagamentos`),
        ]);
        setBarbeiros(resBarbeiros.data);
        setPagamentos(resPagamentos.data);
      } catch (err) {
        console.error("Erro ao carregar auditoria:", err);
      }
    };
    carregar();
  }, []);

  const pagamentosPorBarbeiro = barbeiros.map((barbeiro) => {
    const registros = pagamentos
      .flatMap((p) =>
        (p.barbeiros || [])
          .filter((b) => {
            const idDoPagamento =
              typeof b.barbeiroId === "object" && b.barbeiroId?.$oid
                ? b.barbeiroId.$oid
                : String(b.barbeiroId);

            const barbeiroIdPrincipal = String(barbeiro._id);
            return idDoPagamento === barbeiroIdPrincipal;
          })
          .map((b) => ({
            tipo: p.tipo,
            periodo: p.periodo,
            valor: b.valor,
            pago: b.pago,
            dataPagamento: b.dataPagamento,
          }))
      )
      .sort((a, b) => {
        const aDate = new Date(a.periodo?.inicio || "2000-01-01");
        const bDate = new Date(b.periodo?.inicio || "2000-01-01");
        return bDate - aDate;
      });

    const totalPago = registros
      .filter((r) => r.pago)
      .reduce((acc, r) => acc + r.valor, 0);

    return {
      barbeiro,
      registros,
      totalPago,
    };
  });

  const gerarReciboPDF = (barbeiro, registros, totalPago, logoBase64) => {
    const doc = new jsPDF();

    // Cabeçalho com logo
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 20, 10, 30, 30);
    }

    doc.setFontSize(18);
    doc.text("Barbeirão Barber Shop", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Recibo de Pagamento", 105, 30, { align: "center" });
    doc.line(20, 40, 190, 40);

    // Dados do barbeiro
    doc.setFontSize(12);
    doc.text(`Nome: ${barbeiro.nome}`, 20, 55);
    doc.text(`Telefone: ${barbeiro.telefone || "-"}`, 20, 65);
    doc.text(`Total Pago: ${totalPago.toFixed(2)} MZN`, 20, 75);

    // Detalhes dos registros
    doc.text("Detalhes dos Pagamentos:", 20, 90);
    registros.forEach((r, i) => {
      doc.text(
        `${i + 1}. ${r.tipo.toUpperCase()} (${r.periodo.inicio} → ${r.periodo.fim}) - ${r.valor} MZN - ${
          r.pago ? "Pago" : "Pendente"
        }`,
        25,
        100 + i * 10
      );
    });

    // Rodapé
    doc.line(20, 270, 190, 270);
    doc.setFontSize(10);
    doc.text("Emitido por: Administração Barbeirão", 20, 280);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, 160, 280);

    doc.save(`recibo_${barbeiro.nome}.pdf`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-600">
        Painel de Auditoria de Pagamentos 🧾
      </h2>

      {pagamentosPorBarbeiro.map(({ barbeiro, registros, totalPago }) => (
        <div key={barbeiro._id} className="space-y-2 border-b pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              {barbeiro.nome}
            </h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold text-slate-600">
                Total pago: {totalPago} MZN
              </span>
              <button
                onClick={() => gerarReciboPDF(barbeiro, registros, totalPago)}
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Exportar PDF
              </button>
              {barbeiro.contacto && (
                <a
                  href={`https://wa.me/${barbeiro.contacto}?text=Recibo%20de%20pagamento%20-%20${barbeiro.nome}%0ATotal%20pago:%20${totalPago}%20MZN`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Enviar WhatsApp
                </a>
              )}
            </div>
          </div>

          {registros.length === 0 ? (
            <p className="text-slate-500 italic">Nenhum pagamento registrado.</p>
          ) : (
            <table className="w-full text-sm border border-slate-300 dark:border-slate-600">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="p-2 text-left">Período</th>
                  <th className="p-2 text-left">Tipo</th>
                  <th className="p-2 text-right">Valor</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Data</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-200 dark:border-slate-600"
                  >
                    <td className="p-2">
                      {new Date(r.periodo.inicio).toLocaleDateString("pt-PT")} →{" "}
                      {new Date(r.periodo.fim).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="p-2 capitalize">{r.tipo}</td>
                    <td className="p-2 text-right">{r.valor.toFixed(2)} MZN</td>
                    <td className="p-2 text-center">
                      {r.pago ? (
                        <span className="text-green-600 font-semibold">
                          ✅ Pago
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          ❌ Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {r.dataPagamento
                        ? new Date(r.dataPagamento).toLocaleDateString("pt-PT")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}