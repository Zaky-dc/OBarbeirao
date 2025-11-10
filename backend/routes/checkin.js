const express = require("express");
const router = express.Router();
const Checkin = require("../models/Checkin");

// 🔹 POST /checkin → criar novo agendamento
router.post("/", async (req, res) => {
  try {
    const novo = new Checkin(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    console.error("❌ Erro ao criar check-in:", err);
    res.status(500).json({ erro: "Falha ao criar check-in." });
  }
});



// 🔹 GET /checkin?telefone=84xxxxxxx → consultar agendamentos por telefone
router.get("/", async (req, res) => {
  let { telefone } = req.query;

  if (!telefone) {
    return res.status(400).json({ erro: "Telefone obrigatório para consulta." });
  }

  telefone = telefone.replace(/\D/g, "");
  console.log("📞 Telefone limpo recebido:", telefone);

  try {
    const agendamentos = await Checkin.find({
      telefone,
      cancelado: { $ne: true } // ← exclui cancelados
    }).sort({ horario: -1 });

    if (agendamentos.length === 0) {
      return res.status(404).json({
        telefoneBuscado: telefone,
        mensagem: "Nenhum agendamento encontrado para este número."
      });
    }

    res.json({
      telefoneBuscado: telefone,
      total: agendamentos.length,
      dados: agendamentos
    });
  } catch (err) {
    console.error("❌ Erro ao consultar agendamentos:", err);
    res.status(500).json({ erro: "Erro interno ao consultar agendamentos." });
  }
});

// 🔹 PATCH /checkin/cancelar/:id → cancelar agendamento
router.patch("/cancelar/:id", async (req, res) => {
  try {
    const cancelado = await Checkin.findByIdAndUpdate(
      req.params.id,
      { cancelado: true },
      { new: true }
    );

    if (!cancelado) {
      return res.status(404).json({ erro: "Agendamento não encontrado." });
    }

    res.json({ mensagem: "Agendamento cancelado com sucesso.", dados: cancelado });
  } catch (err) {
    console.error("❌ Erro ao cancelar agendamento:", err);
    res.status(500).json({ erro: "Falha ao cancelar agendamento." });
  }
});

// 🔹 PATCH /checkin/:id → marcar como atendido
router.patch("/:id", async (req, res) => {
  try {
    const atualizado = await Checkin.findByIdAndUpdate(
      req.params.id,
      { atendido: true },
      { new: true }
    );
    if (!atualizado) {
      return res.status(404).json({ erro: "Check-in não encontrado." });
    }
    res.json(atualizado);
  } catch (err) {
    console.error("❌ Erro ao atualizar check-in:", err);
    res.status(500).json({ erro: "Falha ao atualizar check-in." });
  }
});


// 🔹 PATCH /checkin/:id/servicos → adicionar serviços completos ao check-in
router.patch("/:id/servicos", async (req, res) => {
  const { id } = req.params;
  const { servicos } = req.body;

  if (!Array.isArray(servicos) || servicos.length === 0) {
    return res.status(400).json({ erro: "Serviços obrigatórios para atualizar o check-in." });
  }

  try {
    const checkin = await Checkin.findById(id);
    if (!checkin) {
      return res.status(404).json({ erro: "Check-in não encontrado." });
    }

    // Atualiza os serviços diretamente com os objetos recebidos
    checkin.servicos = servicos;
    await checkin.save();

    res.json({
      mensagem: "Serviços adicionados com sucesso.",
      dados: checkin,
    });
  } catch (err) {
    console.error("❌ Erro ao adicionar serviços ao check-in:", err);
    res.status(500).json({ erro: "Falha ao adicionar serviços ao check-in." });
  }
});




// 🔹 GET /checkin/relatorio?mes=10&ano=2025 → relatório mensal acabei desistindo
router.get("/relatorio", async (req, res) => {
  const { mes, ano } = req.query;

  if (!mes || !ano) {
    return res.status(400).json({ erro: "Mês e ano são obrigatórios." });
  }

  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 1);

  try {
    const atendidos = await Checkin.find({
      createdAt: { $gte: inicio, $lt: fim },
      atendido: true,
      cancelado: { $ne: true } // ← exclui cancelados
    }).sort({ createdAt: -1 });

    res.json({ total: atendidos.length, dados: atendidos });
  } catch (err) {
    console.error("❌ Erro ao gerar relatório:", err);
    res.status(500).json({ erro: "Falha ao gerar relatório." });
  }
});

// GET /checkin/fila-presencial
router.get("/fila-presencial", async (req, res) => {
  try {
    const fila = await Checkin.find({
      origem: "presencial",
      cancelado: { $ne: true },
      atendido: false,
    }).sort({ horario: 1 });

    res.json({ total: fila.length, dados: fila });
  } catch (err) {
    console.error("❌ Erro ao consultar fila presencial:", err);
    res.status(500).json({ erro: "Falha ao consultar fila." });
  }
});


// POST /checkin-presencial → registrar cliente presente
router.post("/checkin-presencial", async (req, res) => {
  const { nome, telefone } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({ erro: "Nome e telefone são obrigatórios." });
  }

  const numeroLimpo = telefone.replace(/\D/g, "");

  try {
    const novo = new Checkin({
      nome,
      telefone: numeroLimpo,
      horario: new Date(),
      origem: "presencial",
    });

    await novo.save();

    res.status(201).json({ mensagem: "Check-in presencial registrado com sucesso.", dados: novo });
  } catch (err) {
    console.error("❌ Erro ao registrar check-in presencial:", err);
    res.status(500).json({ erro: "Falha ao registrar check-in presencial." });
  }
});

// Finalizar atendimento
router.post("/:id/finalizar", async (req, res) => {
  const checkin = await Checkin.findById(req.params.id);
  if (!checkin) return res.status(404).json({ erro: "Check-in não encontrado" });

  const { barbeiro, servicos } = req.body;
  const valorTotal = servicos.reduce((acc, s) => acc + s.preco, 0);

  const atendimento = new Atendimento({
    cliente: { nome: checkin.nome, telefone: checkin.telefone },
    barbeiro,
    servicos,
    valorTotal,
    data: new Date()
  });

  await atendimento.save();
  await Checkin.findByIdAndDelete(req.params.id); // ou marcar como atendido

  res.status(201).json(atendimento);
});
// DELETE /checkin/:id - remover cliente da fila
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await Checkin.findByIdAndDelete(id);

    if (!removido) {
      return res.status(404).json({ erro: "Check-in não encontrado" });
    }

    res.status(200).json({ mensagem: "Check-in removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover check-in:", error);
    res.status(500).json({ erro: "Erro ao remover check-in" });
  }
});

//adquirir os agendamentos online
router.get("/agendamentos", async (req, res) => {
  try {
    const agendamentos = await Checkin.find({
      origem: "online"
    }).sort({ horario: 1 });

    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ erro: "Erro ao buscar agendamentos" });
  }
});

//rotas para aprovar ou cancelar

router.patch("/agendamentos/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const update = {};
    if (status === "aprovado") update.atendido = true;
    if (status === "cancelado") update.cancelado = true;

    const atualizado = await Checkin.findByIdAndUpdate(req.params.id, update, { new: true });

    res.json(atualizado);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ erro: "Erro ao atualizar agendamento" });
  }
});



module.exports = router;
