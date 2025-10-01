import { connectDB } from "./config/database.js";
import Slot from "./models/slot.js";
import Agendamento from './models/agendamento.js'; 
import Cliente from './models/cliente.js'; 

async function seedCompleto(baseDate = new Date()) {
    try {
        await connectDB();
        
        console.log("--- INICIANDO LIMPEZA GERAL ---");
        
        // Limpar todas as coleções
        await Agendamento.deleteMany({});
        console.log("Coleção Agendamentos limpa.");
        
        await Cliente.deleteMany({});
        console.log("Coleção Clientes limpa.");

        await Slot.deleteMany({});
        console.log("Coleção Slots limpa.");

        console.log("--- FIM DA LIMPEZA. INICIANDO GERAÇÃO DE SLOTS ---");

        // Capacidade de vagas por horário e dia
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

        const diasDaSemanaTabela = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

        // a partir de hoje do dia atual
        const start = new Date(baseDate);
        start.setHours(0, 0, 0, 0);

        const slots = [];

        //Loop por 7 dias consecutivos 
        for (let i = 0; i < 7; i++) { 
            const d = new Date(start);
            d.setDate(start.getDate() + i);

            const dayIndex = d.getDay(); // 0=Domingo, 1=Segunda

            if (dayIndex === 0) { 
                continue; 
            }
            
            const tabelaIndex = dayIndex - 1; 
            const diaNome = diasDaSemanaTabela[dayIndex];

            for (const horario in tabela) {
                // Usa o índice da tabela correspondente ao dia da semana
                const cap = tabela[horario][tabelaIndex]; 
                
                if (cap <= 0) continue; 
                
                // Configura a data com a hora correta do slot
                const [h, m] = horario.split(':').map(Number);
                d.setHours(h, m, 0, 0);
                
                slots.push({
                    dia: diaNome,
                    data: new Date(d), 
                    horario,
                    capacidade: cap,
                });
            }
        }

        // Inserir os slots
        await Slot.insertMany(slots);
        console.log("Seed concluído. Inseridos", slots.length, "slots para os próximos 7 dias.");
        
        process.exit(0);

    } catch (error) {
        console.error("ERRO NO SEEDING:", error);
        process.exit(1);
    }
}

// Inicia a função única de seeding
seedCompleto().catch((e) => {
    console.error(e);
    process.exit(1);
});