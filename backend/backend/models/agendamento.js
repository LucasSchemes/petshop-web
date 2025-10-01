import mongoose from "mongoose";

const agendamentoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
        required: true,
    },

    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

export default Agendamento;
