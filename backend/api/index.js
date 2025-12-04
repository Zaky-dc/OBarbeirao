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

// --- CORREÇÃO CORS ---
// Permite que o frontend aceda ao backend sem bloqueios
app.use(cors({
  origin: "*", // Permite todas as origens.
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- OTIMIZAÇÃO CONEXÃO MONGODB (SERVERLESS) ---
// Variável global para manter a conexão ativa entre chamadas na Vercel
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = db.connections[0].readyState;
    console.log("=> MongoDB conectado");
  } catch (err) {
    console.error("Erro ao conectar MongoDB:", err);
  }
};

// Middleware para garantir conexão antes de qualquer rota
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// --- ROTAS ---
app.use("/api/servicos", servicoRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/atendimentos", atendimentoRoutes);
app.use("/api/barbeiros", barbeiroRoutes);
app.use("/api/pagamentos", pagamentosRoutes);
app.use("/api/galeria", galeriaRoutes);
app.use("/api/", searchRoutes);

module.exports = app;
