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

app.use((req, res, next) => {
  console.log(`[DEBUG] Request from Origin: ${req.headers.origin}`);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "https://www.barbeirao.com",
        "https://o-barbeirao-z8nt.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5176",
      ];
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        console.log(`[CORS Blocked] Origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar:", err));

app.use("/api/servicos", servicoRoutes);
app.use("/api/checkin", require("../routes/checkin"));
app.use("/api/admin", adminRoutes);
app.use("/api/atendimentos", atendimentoRoutes);
app.use("/api/barbeiros", barbeiroRoutes);
app.use("/api/", searchRoutes);
app.use("/api/pagamentos", pagamentosRoutes);
app.use("/api/galeria", galeriaRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
module.exports = app;
