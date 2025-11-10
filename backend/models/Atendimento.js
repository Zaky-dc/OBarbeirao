const mongoose = require("mongoose");

const atendimentoSchema = new mongoose.Schema({
  cliente: {
    nome: String,
    telefone: String,
  },
  barbeiro: {
    id: mongoose.Schema.Types.ObjectId,
    nome: String,
  },
  servicos: [
    {
      nome: String,
      preco: Number,
    },
  ],
  valorTotal: Number,
  data: Date,
});

module.exports = mongoose.model("Atendimento", atendimentoSchema);
