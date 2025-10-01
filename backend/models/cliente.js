import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    historicoAgendamentos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agendamento",
        },
    ],
});

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
