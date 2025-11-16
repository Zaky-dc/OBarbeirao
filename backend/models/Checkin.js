const mongoose = require("mongoose");

const ServicoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  imageUrl: { type: String }, // opcional
});

const CheckinSchema = new mongoose.Schema({
  nome: String,
  telefone: {
    type: String,
    required: true,
    match: /^[8][2-7]\d{7}$/ // exemplo para números moçambicanos
  },
  horario: Date,
  atendido: { type: Boolean, default: false },
  cancelado: { type: Boolean, default: false },
  origem: { type: String, enum: ["online", "presencial"], default: "online" },
   servicos: [
    {
      nome: { type: String, required: true },
      preco: { type: Number, required: true },
      imageUrl: { type: String }, 
    }
  ],
  barbeiro: {
      type: mongoose.Schema.Types.Mixed, 
      default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model("Checkin", CheckinSchema);