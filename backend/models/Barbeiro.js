const mongoose = require("mongoose");

const barbeiroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  contacto: { type: String, required: true },
  ativo: { type: Boolean, default: true },
  imageUrl:{  type: String, required: true},
  taxaComissao: { type: Number, default: 0.3 }, // 30%
  dataCadastro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Barbeiro", barbeiroSchema);