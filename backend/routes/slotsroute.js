import express from "express";
import connectDB from "./config/db.js";

import slotRoutes from "./routes/slots.js";
import agendamentoRoutes from "./routes/agendamentos.js";
import clienteRoutes from "./routes/clientes.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Conectar DB
connectDB();

// Rotas
app.use("/api/slots", slotRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/clientes", clienteRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
