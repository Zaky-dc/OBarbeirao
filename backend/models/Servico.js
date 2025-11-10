const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  imageUrl:{type:String,required:true}
});

module.exports = mongoose.model("Servico", servicoSchema);