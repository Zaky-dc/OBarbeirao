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
const pagamentosRoutes = require("../routes/pagamentos");
const galeriaRoutes = require("../routes/galeria");

const app = express();

app.use(
  cors({
    origin: [
      "https://www.barbeirao.com",
      "https://o-barbeirao-z8nt.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro ao conectar:", err));

// Rotas
app.get("/api/health-check", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  res.status(200).json({
    status: "ok",
    dbState: dbStateMap[dbState] || "Unknown",
    envMongo: !!process.env.MONGO_URI, // Returns true/false, not the actual URI
  });
});

app.use("/api/servicos", servicoRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/atendimentos", atendimentoRoutes);
app.use("/api/barbeiros", barbeiroRoutes);
app.use("/api/", searchRoutes);
app.use("/api/pagamentos", pagamentosRoutes);
app.use("/api/galeria", galeriaRoutes);

module.exports = app;
