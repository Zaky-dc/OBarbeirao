require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors"); // Removido para usar lógica manual

const adminRoutes = require("../routes/admin");
const atendimentoRoutes = require("../routes/atendimentos");
const barbeiroRoutes = require("../routes/barbeiros");
const searchRoutes = require("../routes/search");
const servicoRoutes = require("../routes/servicos");
const checkinRoutes = require("../routes/checkin");
const pagamentosRoutes = require("../routes/pagamentos");
const galeriaRoutes = require("../routes/galeria");

const app = express();

// --- CONFIGURAÇÃO CORS MANUAL E ROBUSTA ---
// Substitui a biblioteca 'cors' por um controle explícito.
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://o-barbeirao-z8nt.vercel.app", // Deploy antigo
    "https://o-barbeirao.vercel.app",      // Produção atual
    "http://localhost:5173",               // Vite local
    "http://localhost:3000"                // Outro local
  ];

  const origin = req.headers.origin;

  // 1. Verifica se a origem do pedido está na nossa lista branca
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } 
  // (Opcional) Se quiser permitir ferramentas como Postman que não enviam origin:
  // else if (!origin) { res.setHeader("Access-Control-Allow-Origin", "*"); }

  // 2. Define os outros cabeçalhos essenciais
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // 3. TRATAMENTO IMEDIATO DO PREFLIGHT (OPTIONS)
  // Se for uma verificação de CORS, responde OK aqui e morre.
  // Não passa para o banco de dados nem para as rotas.
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// --- OTIMIZAÇÃO CONEXÃO (Lógica Global) ---
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState;
    console.log("=> MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro MongoDB:", err);
    throw err;
  }
};

// --- MIDDLEWARE DE CONEXÃO AO BANCO ---
// Apenas roda se NÃO for OPTIONS (já tratado acima)
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next(); 
  } catch (err) {
    console.error("Falha na conexão DB");
    // Verifica se os cabeçalhos já foram enviados para evitar erro duplo
    if (!res.headersSent) {
      res.status(500).json({ error: "Erro de conexão com o banco de dados" });
    }
  }
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
