import express from "express";
import Agendamento from "../models/agendamento.js";
import Cliente from "../models/cliente.js";
import Slot from "../models/slot.js";

const router = express.Router();

// criar agendamento
router.post("/", async (req, res) => {
  
  try {

    // validar dados
    const { nome, telefone, slotId } = req.body;
    if (!nome || !slotId) return res.status(400).json({ error: "nome e slotId são obrigatórios" });

    // buscar slot
    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ error: "Slot não encontrado" });
    if (slot.capacidade <= 0) return res.status(400).json({ error: "Slot sem vagas" }); //

    // criar ou buscar cliente
    let cliente = await Cliente.findOne({ nome: nome }); //
    if (!cliente) {
      cliente = new Cliente({ nome, telefone }); //
      await cliente.save();
    
    }

    // criar agendamento
    const agendamento = new Agendamento({ cliente: cliente._id, slot: slot._id }); //
    await agendamento.save(); //

    // adicionar agendamento ao histórico do cliente
    cliente.historicoAgendamentos.push(agendamento._id);
    await cliente.save(); 

    slot.capacidade = slot.capacidade - 1; //
    await slot.save(); //

    // retornar agendamento populado
    const pop = await Agendamento.findById(agendamento._id).populate("cliente").populate("slot"); //
    res.status(201).json(pop); 

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar agendamento" }); //
  }
});

// rota para listar todos os agendamentos na página admin
router.get("/", async (req, res) => {
  try {
    const agend = await Agendamento.find().populate("cliente").populate("slot").sort({ criadoEm: -1 });
    res.json(agend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

export default router;
