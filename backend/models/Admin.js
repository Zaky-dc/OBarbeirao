// models/Admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
});

AdminSchema.methods.validarSenha = function (senha) {
  return bcrypt.compare(senha, this.senhaHash);
};

module.exports = mongoose.model("Admin", AdminSchema);
