const express = require("express");
const Galeria = require("../models/Galeria");
const corsMiddleware = require("../middleware/cors"); // <--- IMPORTAR
const router = express.Router();
// APLICAR CORS
router.use(corsMiddleware); // <--- APLICAR

// Criar nova foto (recebe só a URL do Cloudinary)
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

// Listar todas as fotos
router.get("/", async (req, res) => {
  try {
    const fotos = await Galeria.find().sort({ criadoEm: -1 });
    res.json(fotos);
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// Deletar foto
router.delete("/:id", async (req, res) => {
  try {
    const deletada = await Galeria.findByIdAndDelete(req.params.id);
    if (!deletada) return res.status(404).json({ error: "Foto não encontrada" });
    res.json({ message: "Foto removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
