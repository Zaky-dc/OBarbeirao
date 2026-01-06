import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    // Cabeçalhos CORS já configurados no vercel.json
    return res.status(200).end();
  }

  // 2. LOGIN
  if (req.method === "POST" && req.url.includes("/login")) {
    try {
      const { username, senha } = req.body;
      const admin = await Admin.findOne({ username });

      if (!admin || !(await admin.validarSenha(senha))) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "segredoBarbearia", { expiresIn: "2h" });
      return res.status(200).json({ token });
    } catch (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ erro: "Erro interno no login." });
    }
  }

  // 3. CRIAR ADMIN
  if (req.method === "POST" && req.url.includes("/criar-admin")) {
    try {
      const { username, senhaHash } = req.body;
      const novo = new Admin({ username, senhaHash });
      await novo.save();
      return res.status(201).json({ mensagem: "Admin criado com sucesso." });
    } catch (err) {
      console.error("Erro ao criar admin:", err);
      return res.status(500).json({ erro: "Falha ao criar admin." });
    }
  }

  // 4. PEGAR ADMIN LOGADO (/me)
  if (req.method === "GET" && req.url.includes("/me")) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ erro: "Token não fornecido." });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredoBarbearia");
      const admin = await Admin.findById(decoded.id).select("username");
      if (!admin) return res.status(404).json({ erro: "Admin não encontrado." });

      return res.status(200).json({ username: admin.username });
    } catch (err) {
      console.error("Erro ao validar token:", err);
      return res.status(401).json({ erro: "Token inválido." });
    }
  }

  // 5. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}

