const express = require("express");
const mongoose = require("mongoose");
const Galeria = require("../models/Galeria");

const router = express.Router();

// GET /api/galeria → listar todas as fotos
router.get("/", async (req, res) => {
  try {
    const fotos = await Galeria.find().sort({ criadoEm: -1 });
    res.status(200).json(fotos);
  } catch (err) {
    console.error("Erro ao listar fotos:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// POST /api/galeria → criar nova foto
router.post("/", async (req, res) => {
  try {
    const novaFoto = new Galeria({ url: req.body.url });
    await novaFoto.save();
    res.status(201).json(novaFoto);
  } catch (err) {
    console.error("Erro ao adicionar foto:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// DELETE /api/galeria/:id → remover foto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletada = await Galeria.findByIdAndDelete(id);
    if (!deletada) {
      return res.status(404).json({ error: "Foto não encontrada" });
    }
    res.status(200).json({ message: "Foto removida com sucesso" });
  } catch (err) {
    console.error("Erro ao remover foto:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
