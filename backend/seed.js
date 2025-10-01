import { connectDB } from "./config/database.js";
import Slot from "./models/slot.js";
import Agendamento from './models/agendamento.js'; 
import Cliente from './models/cliente.js'; 

async function seedCompleto(baseDate = new Date()) {
    try {
        await connectDB();
        
        console.log("--- INICIANDO LIMPEZA GERAL ---");
        
        // Limpar
        await Agendamento.deleteMany({});
        console.log("Coleção Agendamentos limpa.");
        
        await Cliente.deleteMany({});
        console.log("Coleção Clientes limpa.");

        // 
        await Slot.deleteMany({});
        console.log("Coleção Slots limpa.");

        console.log("--- FIM DA LIMPEZA. INICIANDO GERAÇÃO DE SLOTS ---");

        // Geração da lógica de Slots 
        const tabela = {
            "08:00": [1, 2, 1, 2, 2, 1],
            "09:00": [1, 2, 1, 2, 2, 1],
            "10:00": [1, 2, 1, 2, 2, 1],
            "11:00": [1, 2, 1, 2, 2, 1],
            "14:00": [1, 2, 1, 2, 2, 0],
            "15:00": [1, 2, 1, 2, 2, 0],
            "16:00": [1, 2, 1, 2, 2, 0],
            "17:00": [1, 2, 1, 2, 2, 0],
        };

        const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

        // Lógica de cálculo da data de início da semana
        const start = new Date(baseDate);
        start.setHours(0, 0, 0, 0);

        const dayOfWeek = start.getDay(); 
        const daysToMonday = (dayOfWeek === 0 ? 1 : (1 - dayOfWeek + 7) % 7);
        start.setDate(start.getDate() + daysToMonday);

        const slots = [];

        for (let i = 0; i < 6; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);

            for (const horario in tabela) {
                const cap = tabela[horario][i];
                if (cap <= 0) continue; 
               
                const [h, m] = horario.split(':').map(Number);
                d.setHours(h, m, 0, 0);
                
                slots.push({
                    dia: dias[i],
                    data: new Date(d), 
                    horario,
                    capacidade: cap,
                });
            }
        }

        // Inserir os slots
        await Slot.insertMany(slots);
        console.log("Seed concluído. Inseridos", slots.length, "slots para a semana atual.");
        
        process.exit(0);

    } catch (error) {
        console.error("ERRO NO SEEDING:", error);
        process.exit(1);
    }
}

// Inicia a função seeding
seedCompleto().catch((e) => {
    console.error(e);
    process.exit(1);
});