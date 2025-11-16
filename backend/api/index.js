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
const pagamentosRoutes = require("./routes/pagamentos");
const galeriaRoutes = require("./routes/galeria");

const app = express();

// Lista de origens permitidas (admin + cliente)
const allowedOrigins = [
  "https://www.barbeirao.com",          // cliente
  "https://o-barbeirao-z8nt.vercel.app", // admin (Vercel)
  "http://localhost:5173",              // dev cliente
  "http://localhost:3000"               // dev admin
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex.: curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS não permitido para esta origem"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

// Rotas
app.use("/api/servicos", servicoRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/atendimentos", atendimentoRoutes);
app.use("/api/barbeiros", barbeiroRoutes);
app.use("/api/", searchRoutes);
app.use("/api/pagamentos", pagamentosRoutes);
app.use("/api/galeria", galeriaRoutes);

module.exports = app;