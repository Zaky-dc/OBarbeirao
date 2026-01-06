import mongoose from "mongoose";
import Atendimento from "../models/Atendimento.js";
import Checkin from "../models/Checkin.js";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 2. GET /api/search → busca atendimentos e agendamentos online
  if (req.method === "GET" && req.url.includes("/search")) {
    const { query } = req.query;
    const regex = { $regex: query, $options: "i" };

    try {
      const atendimentos = await Atendimento.find({
        $or: [
          { "cliente.nome": regex },
          { "cliente.telefone": regex },
          { "barbeiro.nome": regex },
          { "servicos.nome": regex },
        ],
      });

      const checkins = await Checkin.find({
        $and: [
          { origem: "online" }, // apenas agendamentos online
          {
            $or: [
              { nome: regex },
              { telefone: regex },
              { servicos: { $elemMatch: { nome: regex } } },
            ],
          },
        ],
      });

      return res.status(200).json({ atendimentos, agendamentosOnline: checkins });
    } catch (error) {
      console.error("Erro na busca:", error);
      return res.status(500).json({ erro: "Erro ao buscar dados" });
    }
  }

  // 3. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}
