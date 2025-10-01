import express from "express";
import Agendamento from "../models/agendamento.js";
import Cliente from "../models/cliente.js";
import Slot from "../models/slot.js";

const router = express.Router();

// 🔹 Criar agendamento
router.post("/", async (req, res) => {
    try {
        const { clienteId, slotId } = req.body;

        // Buscar slot
        const slot = await Slot.findById(slotId);
        if (!slot || slot.capacidade <= 0) {
            return res.status(400).json({ erro: "Slot indisponível" });
        }

        // Criar agendamento
        const agendamento = new Agendamento({
            cliente: clienteId,
            slot: slotId,
        });
        await agendamento.save();

        // Atualizar capacidade do slot
        slot.capacidade -= 1;
        await slot.save();

        // Adicionar no histórico do cliente
        await Cliente.findByIdAndUpdate(clienteId, {
            $push: { historicoAgendamentos: agendamento._id },
        });

        res.status(201).json(agendamento);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar agendamento" });
    }
});

// 🔹 Listar agenda do Pet Shop
router.get("/", async (req, res) => {
    try {
        const agenda = await Agendamento.find()
            .populate("cliente", "nome telefone")
            .populate("slot", "data horario");

        res.json(agenda);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar agenda" });
    }
});

export default router;
