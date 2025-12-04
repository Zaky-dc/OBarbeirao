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

app.use(cors());
app.use(express.json());

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("=> Usando conexão de banco de dados existente");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      // Opções recomendadas para evitar timeouts
      serverSelectionTimeoutMS: 5000, 
    });
    isConnected = db.connections[0].readyState;
    console.log("=> Nova conexão com banco de dados estabelecida");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    throw err; // Lança o erro para que a requisição falhe explicitamente se não houver DB
  }
};

// Middleware para garantir conexão antes das rotas
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: "Erro de conexão com o banco de dados" });
  }
});

// Rotas
app.use("/api/servicos", servicoRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/atendimentos", atendimentoRoutes);
app.use("/api/barbeiros", barbeiroRoutes);
app.use("/api/pagamentos", pagamentosRoutes);
app.use("/api/galeria", galeriaRoutes);
app.use("/api/", searchRoutes);

module.exports = app;
