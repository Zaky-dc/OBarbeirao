require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("../routes/admin");
const atendimentoRoutes = require("../routes/atendimentos");
const barbeiroRoutes = require("../routes/barbeiros");
const searchRoutes = require("../routes/search");
const servicoRoutes = require("../routes/servicos");
const pagamentosRoutes = require("../routes/pagamentos");
const galeriaRoutes = require("../routes/galeria");

const app = express();

app.use(cors({
  origin: [
    "https://www.barbeirao.com",
    "https://o-barbeirao-z8nt.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar:", err));

app.use("/api/servicos", servicoRoutes);
app.use("/api/checkin", require("../routes/checkin"));
app.use("/api/admin", adminRoutes);
app.use("/api/atendimentos", atendimentoRoutes);
app.use("/api/barbeiros", barbeiroRoutes);
app.use("/api/", searchRoutes);
app.use("/api/pagamentos", pagamentosRoutes);
app.use("/api/galeria", galeriaRoutes);
//  app.listen(3000)
// ✅ ADD:
module.exports = app;