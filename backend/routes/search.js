const express = require("express");
const Atendimento = require("../models/Atendimento");
const Checkin = require("../models/Checkin");
// const Agendamento = require("../models/Agendamento");

const router = express.Router();

router.get("/search", async (req, res) => {
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
        { origem: "online" }, // ✅ filtra apenas agendamentos online
        {
          $or: [
            { nome: regex },
            { telefone: regex },
            { servicos: { $elemMatch: { nome: regex } } },
          ],
        },
      ],
    });

    res.json({ atendimentos, agendamentosOnline: checkins });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ erro: "Erro ao buscar dados" });
  }
});


module.exports = router;