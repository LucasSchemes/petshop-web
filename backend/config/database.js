import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/petshop");
        console.log("MongoDB conectado!");
    } catch (error) {
        console.error("Erro ao conectar no MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
