const mongoose = require("mongoose");

const GaleriaSchema = new mongoose.Schema({
  url: { type: String, required: true }, // apenas a URL da imagem
  criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Galeria", GaleriaSchema);