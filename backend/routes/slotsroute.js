import express from "express";
import Slot from "../models/slot.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const now = new Date();
        const slots = await Slot.find({
            capacidade: { $gt: 0 },
            data: { $gte: now }}).sort({ data: 1, horario: 1});
        res.json(slots);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar slots" });
    }
});

// buscar apenas slots com vagas > 0 e data futura
router.get("/disponiveis", async (req, res) => {
    try {
        
        const now = new Date();
        const disponiveis = await Slot.find({ 
            capacidade: { $gt: 0 },
            data: { $gt: now }
        }).sort({ data: 1, horario: 1 }); 
        
        // retornar JSON
        res.json(disponiveis);
    
    // erro
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar horários disponíveis" });
    }
});

// decrementar vagas de um slot
router.put("/:id", async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ error: "Slot não encontrado" });
        }
       
        if (slot.capacidade <= 0) {
            return res.status(400).json({ error: "Sem vagas nesse horário" });
        }

        slot.capacidade -= 1;
        await slot.save();

        res.json(slot);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar slot" });
    }
});

export default router;

