import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
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
        min: 0,
    },
});

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
