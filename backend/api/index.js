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

// --- CONFIGURAÇÃO CORS DINÂMICA (Múltiplos Domínios) ---
const allowedOrigins = [
  "https://o-barbeirao-z8nt.vercel.app", // Link antigo/deploy de preview
  "https://o-barbeirao.vercel.app",      // Link de produção atual
  "http://localhost:5173",               // Desenvolvimento local
  "http://localhost:3000"                // Desenvolvimento local alternativo
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir pedidos sem origem (como Postman ou Apps Móveis nativas)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem está na lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error("Bloqueado por CORS:", origin);
      callback(new Error('Bloqueado pela política de CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

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

// --- MIDDLEWARE INTELIGENTE ---
app.use(async (req, res, next) => {
  // 🛠️ 1. TRATAMENTO DO PREFLIGHT (OPTIONS) 🛠️
  // O middleware 'cors' acima JÁ respondeu com os headers corretos.
  // Aqui apenas garantimos que a execução pare e retorne 200 OK sem tocar no banco.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 🛠️ 2. CONEXÃO AO BANCO APENAS PARA PEDIDOS REAIS
  try {
    await connectToDatabase();
    next(); 
  } catch (err) {
    console.error("Falha na conexão DB");
    res.status(500).json({ error: "Erro de conexão com o banco de dados" });
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
