import express from "express";
import Cliente from "../models/cliente.js";

const router = express.Router();

// 🔹 Criar cliente
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

// 🔹 Listar clientes
router.get("/", async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar clientes" });
    }
});

export default router;
