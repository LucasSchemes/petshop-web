import express from "express";
import Cliente from "../models/cliente.js";

const router = express.Router();

// criar cliente
router.post("/", async (req, res) => {
    try {
        const { nome, telefone } = req.body;
        const cliente = new Cliente({ nome, telefone });
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar cliente" });
    }
});

// listar clientes
router.get("/", async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar clientes" });
    }
});

// identificar cliente pelo telefone
router.post("/identificar", async (req, res) => {
    try {
        const { telefone } = req.body;
        // Busca o cliente pelo telefone
        const cliente = await Cliente.findOne({ telefone }); 

        if (!cliente) {
            // Se não encontrar, retorna 404 para o frontend pedir o cadastro
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }
        // Retorna o cliente (com o ID)
        res.json(cliente); 

    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar cliente" });
    }
});

export default router;
