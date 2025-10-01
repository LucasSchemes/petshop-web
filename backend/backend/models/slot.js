import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({

    dia: {
        type: String, 
        required: true,
    },

    data: {
        type: Date,
        required: true,
    },
    horario: {
        type: String, // Ex: "14:00"
        required: true,
    },
    capacidade: {
        type: Number,
        required: true,
        default: 1,
    },
});

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
