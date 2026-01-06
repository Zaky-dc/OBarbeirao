import mongoose from "mongoose";
import Galeria from "../models/Galeria.js";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 2. POST /api/galeria → criar nova foto
  if (req.method === "POST" && req.url.endsWith("/galeria")) {
    try {
      const novaFoto = new Galeria({ url: req.body.url });
      await novaFoto.save();
      return res.status(201).json(novaFoto);
    } catch (err) {
      console.error("Erro ao adicionar foto:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 3. GET /api/galeria → listar todas as fotos
  if (req.method === "GET" && req.url.endsWith("/galeria")) {
    try {
      const fotos = await Galeria.find().sort({ criadoEm: -1 });
      return res.status(200).json(fotos);
    } catch (err) {
      console.error("Erro ao listar fotos:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 4. DELETE /api/galeria/:id → remover foto
  if (req.method === "DELETE" && req.url.match(/\/galeria\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const deletada = await Galeria.findByIdAndDelete(id);
      if (!deletada) {
        return res.status(404).json({ error: "Foto não encontrada" });
      }
      return res.status(200).json({ message: "Foto removida com sucesso" });
    } catch (err) {
      console.error("Erro ao remover foto:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 5. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}
