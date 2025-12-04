const express = require("express");
const Barbeiro = require("../models/Barbeiro");
const Atendimento = require("../models/Atendimento");
// Importa o middleware de autenticação (verifique se o caminho do arquivo é exato)
const authMiddleware = require("../middleware/autenticao"); 

const router = express.Router();

// Rota pública: Listar barbeiros (usado no select do agendamento, etc)
router.get("/", async (req, res) => {
  try {
    const barbeiros = await Barbeiro.find({ ativo: true }); // Opcional: filtrar apenas ativos
    res.json(barbeiros);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar barbeiros" });
  }
});

// Rota PROTEGIDA: Fecho Mensal
// Adicionei 'authMiddleware' aqui para resolver o problema de segurança
router.get("/fecho-mensal", authMiddleware, async (req, res) => {
  try {
    const mes = parseInt(req.query.mes); // 1–12
    const ano = parseInt(req.query.ano);

    if (!mes || !ano) {
      return res.status(400).json({ erro: "Mês e Ano são obrigatórios" });
    }

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 1);

    // Busca atendimentos no período
    const atendimentos = await Atendimento.find({
      data: { $gte: inicio, $lt: fim }
    });

    const barbeiros = await Barbeiro.find();

    const resumo = barbeiros.map((barbeiro) => {
      // CORREÇÃO CRÍTICA AQUI:
      // O campo 'a.barbeiro' geralmente é um ObjectId se não usar populate().
      // 'a.barbeiro.id' retornava undefined, quebrando a lógica.
      const atendimentosDoBarbeiro = atendimentos.filter((a) => {
         if (!a.barbeiro) return false;
         // Compara convertendo ambos para String para garantir
         const idAtendimento = a.barbeiro._id ? a.barbeiro._id : a.barbeiro;
         return String(idAtendimento) === String(barbeiro._id);
      });

      const receita = atendimentosDoBarbeiro.reduce((acc, a) => acc + (a.valorTotal || 0), 0);
      
      // Garante que a taxa é um número
      const taxa = barbeiro.taxaComissao || 0.3;
      const comissao = receita * taxa;

      return {
        barbeiro: barbeiro.nome,
        totalAtendimentos: atendimentosDoBarbeiro.length,
        receita,
        comissao,
        taxaComissao: taxa
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

// POST e PUT devem ser protegidos também
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { nome, contacto, taxaComissao, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ erro: "URL da imagem é obrigatória" });
    }

    const novo = new Barbeiro({ nome, contacto, taxaComissao, imageUrl });
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    console.error("Erro ao cadastrar barbeiro:", err);
    res.status(500).json({ erro: "Erro ao cadastrar barbeiro" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
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

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Barbeiro.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Barbeiro removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover barbeiro" });
  }
});

module.exports = router;
