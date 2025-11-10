const express = require("express");
const Barbeiro = require("../models/Barbeiro");
const Atendimento = require("../models/Atendimento");

const router = express.Router();

router.get("/", async (req, res) => {
  const barbeiros = await Barbeiro.find();
  res.json(barbeiros);
});

router.get("/fecho-mensal", async (req, res) => {
  try {
    const mes = parseInt(req.query.mes); // 1–12
    const ano = parseInt(req.query.ano);

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 1);

    const atendimentos = await Atendimento.find({
      data: { $gte: inicio, $lt: fim }
    });

    const barbeiros = await Barbeiro.find();

    const resumo = barbeiros.map((barbeiro) => {
      const atendimentosDoBarbeiro = atendimentos.filter(
        (a) => a.barbeiro.id.toString() === barbeiro._id.toString()
      );

      const receita = atendimentosDoBarbeiro.reduce((acc, a) => acc + a.valorTotal, 0);
      const comissao = receita * (barbeiro.taxaComissao || 0.3);

      return {
        barbeiro: barbeiro.nome,
        totalAtendimentos: atendimentosDoBarbeiro.length,
        receita,
        comissao,
        taxaComissao: barbeiro.taxaComissao || 0.3
      };
    });

    res.json(resumo);
  } catch (error) {
    console.error("Erro ao gerar fecho mensal:", error);
    res.status(500).json({ erro: "Erro ao gerar fecho mensal" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findById(req.params.id);
    if (!barbeiro) {
      return res.status(404).json({ erro: "Barbeiro não encontrado" });
    }
    res.json(barbeiro);
  } catch (err) {
    console.error("Erro ao buscar barbeiro:", err);
    res.status(500).json({ erro: "Erro ao buscar barbeiro" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, contacto, taxaComissao } = req.body;
    const novo = new Barbeiro({ nome, contacto, taxaComissao });
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar barbeiro" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nome, contacto, taxaComissao } = req.body;
    const atualizado = await Barbeiro.findByIdAndUpdate(
      req.params.id,
      { nome, contacto, taxaComissao },
      { new: true }
    );
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar barbeiro" });
  }
});


// DELETE - excluir barbeiro
router.delete("/:id", async (req, res) => {
  try {
    await Barbeiro.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Barbeiro removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover barbeiro" });
  }
});



module.exports = router;