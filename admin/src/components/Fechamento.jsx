// Fechamento.jsx
import { useState } from "react";
import FechamentoSemanal from "./FechamentoSemanal";
import FechamentoMensal from "./FechamentoMensal";
import ExtratoFinanceiro from "./ExtratoFinanceiro";
import HistoricoPagamentos from "./HistoricoPagamentos";

export default function Fechamento() {
  const [aba, setAba] = useState("semanal");

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setAba("semanal")}
          className={`px-4 py-2 rounded-t ${
            aba === "semanal" ? "bg-amber-600 text-white" : "bg-slate-200"
          }`}
        >
          Semanal
        </button>
        <button
          onClick={() => setAba("mensal")}
          className={`px-4 py-2 rounded-t ${
            aba === "mensal" ? "bg-amber-600 text-white" : "bg-slate-200"
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setAba("extrato")}
          className={`px-4 py-2 rounded-t ${
            aba === "extrato" ? "bg-amber-600 text-white" : "bg-slate-200"
          }`}
        >
          Extrato
        </button>
         <button
          onClick={() => setAba("historico")}
          className={`px-4 py-2 rounded-t ${
            aba === "historico" ? "bg-amber-600 text-white" : "bg-slate-200"
          }`}
        >
          Historico pagamentos
        </button>
      </div>

      {aba === "semanal" && <FechamentoSemanal />}
      {aba === "mensal" && <FechamentoMensal />}
      {aba === "extrato" && <ExtratoFinanceiro />}
      {aba==="historico"&&<HistoricoPagamentos/>}
    </div>
  );
}
