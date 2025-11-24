const mongoose = require("mongoose");

const BarbeiroPagamentoSchema = new mongoose.Schema({
  barbeiroId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Barbeiro",
  },
  nome: {
    type: String,
    required: true,
  },
  valorTotalMes: {
    type: Number, // total da comissão do barbeiro no mês
    required: true,
  },
  jaPagoSemanal: {
    type: Number, // quanto já foi pago nos fechamentos semanais
    default: 0,
  },
  faltava: {
    type: Number, // quanto faltava e foi assumido no fechamento mensal
    default: 0,
  },
  pago: {
    type: Boolean,
    default: false,
  },
  dataPagamento: {
    type: Date,
  },
  atendimentoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Atendimento",
  },
});

const DespesaSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  valor: { type: Number, required: true },
  recibo: { type: String, required: true }, // número de recibo
  observacao: { type: String },
});

const AdminSchema = new mongoose.Schema({
  valor: { type: Number, required: true },
  pago: { type: Boolean, default: false },
  dataPagamento: { type: Date },
});

const PagamentoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["semanal", "mensal"],
    required: true,
  },
  periodo: {
    inicio: { type: String, required: true },
    fim: { type: String, required: true },
  },
  barbeiros: [BarbeiroPagamentoSchema],
  despesas: {[DespesaSchema],required:false,default:[]},
  admin: {AdminSchema,required:false},
  totalBruto: { type: Number, required: true },
  totalLiquido: { type: Number, required: true },
});

module.exports = mongoose.model("Pagamento", PagamentoSchema);
