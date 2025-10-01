import { connectDB } from "./config/database.js";
import Slot from "./models/slot.js";

// gerar slots
async function gerarSlotsSemana(baseDate = new Date()) {
  await connectDB();

  // capacidade de vagas por horario e dia
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

  // achar a segunda-feira mais próxima
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  const dayOfWeek = start.getDay(); 
  const daysToMonday = (dayOfWeek === 0 ? 1 : (1 - dayOfWeek + 7) % 7);
  start.setDate(start.getDate() + daysToMonday);

  const slots = [];

  for (let i = 0; i < 6; i++) { // segunda a sábado
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    for (const horario in tabela) {
      const cap = tabela[horario][i];
      if (cap <= 0) continue; // ignora se capacidade = 0
      slots.push({
        dia: dias[i],
        data: d,
        horario,
        capacidade: cap,
      });
    }
  }

  // limpar e inserir
  await Slot.deleteMany({});
  await Slot.insertMany(slots);
  console.log("Seed concluído. Inseridos", slots.length, "slots para a semana atual.");
  process.exit(0);
}

gerarSlotsSemana().catch((e) => {
  console.error(e);
  process.exit(1);
});
