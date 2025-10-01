// backend/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";
import slotRoutes from "./routes/slotsroute.js";
import agendamentosRoutes from "./routes/agendamentosroute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

connectDB(); // conecta ao MongoDB

// rotas API
app.use("/api/slots", slotRoutes);
app.use("/api/agendamentos", agendamentosRoutes);

// servir frontend estático
app.use(express.static(path.join(__dirname, "../frontend/public")));

// fallback para SPA / páginas estáticas
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
