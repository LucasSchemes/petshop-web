import express from "express";
import Slot from "../models/slot.js";

const router = express.Router();


// exemplo de rota
router.get("/", async (req, res) => {
    try {
        const slots = await Slot.find();
        res.json(slots);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar slots" });
    }
});

//
// 2. Listar apenas slots disponíveis (para cliente)
//    GET /api/horarios
//
router.get("/disponiveis", async (req, res) => {
    try {
        const disponiveis = await Slot.find({ vagas: { $gt: 0 } });
        res.json(disponiveis);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar horários disponíveis" });
    }
});

//
// 3. Decrementar vagas de um slot (quando agenda)
//    PUT /api/slots/:id
//
router.put("/:id", async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ error: "Slot não encontrado" });
        }
        if (slot.vagas <= 0) {
            return res.status(400).json({ error: "Sem vagas nesse horário" });
        }

        slot.vagas -= 1;
        await slot.save();

        res.json(slot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar slot" });
    }
});

export default router;

