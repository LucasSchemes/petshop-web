let slots = []; // Armazena todos os horários disponíveis vindos da API
let selectedDay = null; // Guarda a data do dia que o usuário selecionou
let clienteIdentificado = null; // Guarda o objeto do cliente após a identificação

// Função assíncrona para buscar os slots (horários) disponíveis da API.
async function carregarSlots() {
  try {
    const res = await fetch("/api/slots");
    if (!res.ok) throw new Error("Erro ao buscar slots");
    slots = await res.json();
    montarCalendario();
  } catch (err) {
    console.error(err);
    document.getElementById("calendar").innerHTML = "<p>Erro ao carregar calendário.</p>";
  }
}

// Constrói e exibe os cards dos dias disponíveis no calendário.
function montarCalendario() {
  const container = document.getElementById("calendar");
  container.innerHTML = "";

  // Extrai uma lista de dias únicos a partir dos slots recebidos
  const diasUnicos = [...new Set(slots.map(s => new Date(s.data).toDateString()))]
    .map(str => new Date(str))
    .sort((a,b) => a - b);

  // Para cada dia único, cria um card clicável
  diasUnicos.forEach(d => {
    const div = document.createElement("div");
    div.className = "day-card";
    div.dataset.date = d.toDateString();
    div.innerHTML = `<div>${d.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                     <div><strong>${d.getDate()}/${d.getMonth()+1}</strong></div>`;
    div.addEventListener("click", () => selecionarDia(d));
    container.appendChild(div);
  });
}

// Quando um dia é selecionado, exibe os horários disponíveis para aquele dia.
function selecionarDia(date) {
  selectedDay = date.toDateString();

  document.querySelectorAll(".day-card").forEach(el => {
    el.classList.toggle("active", el.dataset.date === selectedDay);
  });

  const container = document.getElementById("slots-container");
  container.innerHTML = "";

  // Filtra a lista completa de slots para pegar apenas os do dia selecionado
  const slotsDoDia = slots.filter(s => new Date(s.data).toDateString() === selectedDay);
  if (slotsDoDia.length === 0) {
    container.innerHTML = "<p>Nenhum horário disponível para este dia.</p>";
    return;
  }

  // Para cada slot do dia, cria um botão de horário
  slotsDoDia.forEach(s => {
    const btn = document.createElement("div");
    btn.className = "slot";
    btn.textContent = `${s.horario} (${s.capacidade} vagas)`;
    btn.addEventListener("click", () => selecionarSlot(s));
    container.appendChild(btn);
  });
}

// Quando um horário é selecionado, exibe o formulário de agendamento.
function selecionarSlot(slot) {
  document.getElementById("agendamento-form").classList.remove("hidden");
  document.getElementById("slot-id").value = slot._id;
  document.getElementById("slot-info").textContent =
    `${new Date(slot.data).toLocaleDateString()} ${slot.horario}`;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// Event Listener para o formulário de identificação do cliente.
document.getElementById("identificacao-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const telefone = document.getElementById("ident-telefone").value.trim();
    const msgDiv = document.getElementById("identificacao-mensagem");
    const cadastroForm = document.getElementById("cadastro-form");

    msgDiv.textContent = "";
    cadastroForm.classList.add("hidden"); 

    if (!telefone) return;

    try {
        // Envia o telefone para a API para tentar identificar o cliente
        const res = await fetch("/api/clientes/identificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefone })
        });

        const data = await res.json();
        
        // Se o cliente não for encontrado, mostra o formulário de cadastro
        if (!res.ok) {

            msgDiv.style.color = "red";
            msgDiv.textContent = "Cliente não encontrado. Por favor, cadastre-se.";

            cadastroForm.classList.remove("hidden");
          
            document.getElementById("cad-telefone").value = telefone;
            document.getElementById("cad-nome").value = ""; 
            clienteIdentificado = null;

            document.getElementById("agendamento-principal").classList.add("hidden");
            return;
        }
        
        // Se o cliente foi encontrado com sucesso, armazena os dados e mostra a seção de agendamento
        clienteIdentificado = data;

        document.getElementById("identificacao").classList.add("hidden");

        document.getElementById("cliente-nome-info").textContent = data.nome; 

        document.getElementById("agendamento-principal").classList.remove("hidden");
        msgDiv.textContent = `Olá, ${data.nome}! Você já pode agendar.`;
        msgDiv.style.color = "green";

        await carregarSlots();

    } catch (err) {
        msgDiv.style.color = "red";
        msgDiv.textContent = "Erro de rede. Verifique sua conexão.";
        console.error(err);
    }
});

// Event Listener para o formulário de cadastro de um novo cliente.
document.getElementById("cadastro-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("cad-nome").value.trim();
    const telefone = document.getElementById("cad-telefone").value.trim();
    const msgDiv = document.getElementById("cadastro-mensagem");

    if (!nome || !telefone) return;

    try {
        // Envia os dados do novo cliente para a API
        const res = await fetch("/api/clientes", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, telefone })
        });

        const data = await res.json();

        if (!res.ok) {
            msgDiv.style.color = "red";
            msgDiv.textContent = data.erro || "Erro ao cadastrar cliente.";
            return;
        }
        
        // Se o cadastro foi bem-sucedido, armazena os dados e atualiza a interface
        clienteIdentificado = data;

        document.getElementById("identificacao").classList.add("hidden");
  
        document.getElementById("identificacao-mensagem").textContent = `Bem-vindo(a), ${data.nome}! Você já pode agendar.`;
        document.getElementById("identificacao-mensagem").style.color = "green";
        document.getElementById("agendamento-principal").classList.remove("hidden");

        document.getElementById("cliente-nome-info").textContent = data.nome; 
        
        await carregarSlots();

    } catch (err) {
        msgDiv.style.color = "red";
        msgDiv.textContent = "Erro de rede no cadastro. Tente novamente.";
        console.error(err);
    }
});

// Event Listener para o formulário de confirmação de agendamento.
document.getElementById("agendamento-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Validação para garantir que um cliente está identificado
  if (!clienteIdentificado) {
      alert("Você precisa se identificar antes de agendar.");
      return;
  }
  
  const clienteId = clienteIdentificado._id; 
  const slotId = document.getElementById("slot-id").value;
  const mensagemDiv = document.getElementById("mensagem");

  if (!clienteId || !slotId) return;

  try {
    // Envia o ID do cliente e do slot para a API para criar o agendamento
    const res = await fetch("/api/agendamentos", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ clienteId, slotId })
    });
    const data = await res.json();
    if (!res.ok) {
      mensagemDiv.style.color = "red";
      mensagemDiv.textContent = data.error || "Erro ao agendar";
      return;
    }
    
    // Se o agendamento foi confirmado com sucesso, atualiza a interface
    mensagemDiv.style.color = "green";
    mensagemDiv.textContent = `Agendamento confirmado para ${data.slot.horario} em ${new Date(data.slot.data).toLocaleDateString()}.`;
    document.getElementById("agendamento-form").classList.add("hidden");
    

    await carregarSlots();
    selecionarDia(new Date(data.slot.data));
    
  } catch (err) {
    mensagemDiv.style.color = "red";
    mensagemDiv.textContent = "Erro ao processar agendamento.";
    console.error(err);
  }
});

