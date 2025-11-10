// api/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRoutes = require("../routes/admin");
const atendimentoRoutes = require("../routes/atendimentos");
const barbeiroRoutes = require("../routes/barbeiros");
const searchRoutes = require("../routes/search");
const servicoRoutes = require("../routes/servicos");
const checkinRoutes = require("../routes/checkin");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

app.use("/servicos", servicoRoutes);
app.use("/checkin", checkinRoutes);
app.use("/admin", adminRoutes);
app.use("/atendimentos", atendimentoRoutes);
app.use("/barbeiros", barbeiroRoutes);
app.use("/", searchRoutes);

module.exports = app;
