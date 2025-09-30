import express from "express";
import slotRoutes from "./routes/slotsroute.js";
import clientesRoutes from "./routes/clientesroute.js";
import agendamentosRoutes from "./routes/agendamentosroute.js";
import path from "path";
import { fileURLToPath } from "url";

// necessário porque em ES Modules não existe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// usa as rotas da API
app.use("/api/slots", slotRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/agendamentos", agendamentosRoutes);

// 🔥 Alias para compatibilidade com o frontend (espera /api/horarios)
app.use("/api/horarios", slotRoutes);

// rota raiz simples
app.get("/api", (req, res) => {
    res.json({ message: "API Petshop rodando! 🚀" });
});

// servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend/public")));

// rota padrão manda para index.html (frontend SPA ou páginas)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
