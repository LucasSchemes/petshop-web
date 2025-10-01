let slots = [];
let selectedDay = null;
let clienteIdentificado = null;

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

function montarCalendario() {
  const container = document.getElementById("calendar");
  container.innerHTML = "";


  const diasUnicos = [...new Set(slots.map(s => new Date(s.data).toDateString()))]
    .map(str => new Date(str))
    .sort((a,b) => a - b);

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

function selecionarDia(date) {
  selectedDay = date.toDateString();

  document.querySelectorAll(".day-card").forEach(el => {
    el.classList.toggle("active", el.dataset.date === selectedDay);
  });

  const container = document.getElementById("slots-container");
  container.innerHTML = "";

  const slotsDoDia = slots.filter(s => new Date(s.data).toDateString() === selectedDay);
  if (slotsDoDia.length === 0) {
    container.innerHTML = "<p>Nenhum horário disponível para este dia.</p>";
    return;
  }

  slotsDoDia.forEach(s => {
    const btn = document.createElement("div");
    btn.className = "slot";
    btn.textContent = `${s.horario} (${s.capacidade} vagas)`;
    btn.addEventListener("click", () => selecionarSlot(s));
    container.appendChild(btn);
  });
}

function selecionarSlot(slot) {
  document.getElementById("agendamento-form").classList.remove("hidden");
  document.getElementById("slot-id").value = slot._id;
  document.getElementById("slot-info").textContent =
    `${new Date(slot.data).toLocaleDateString()} ${slot.horario}`;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}


document.getElementById("identificacao-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const telefone = document.getElementById("ident-telefone").value.trim();
    const msgDiv = document.getElementById("identificacao-mensagem");
    const cadastroForm = document.getElementById("cadastro-form"); // Novo atalho

    msgDiv.textContent = "";
    cadastroForm.classList.add("hidden"); 

    if (!telefone) return;

    try {
        const res = await fetch("/api/clientes/identificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefone })
        });

        const data = await res.json();

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

document.getElementById("cadastro-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("cad-nome").value.trim();
    const telefone = document.getElementById("cad-telefone").value.trim();
    const msgDiv = document.getElementById("cadastro-mensagem");

    if (!nome || !telefone) return;

    try {
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

document.getElementById("agendamento-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!clienteIdentificado) {
      alert("Você precisa se identificar antes de agendar.");
      return;
  }
  
  const clienteId = clienteIdentificado._id; 
  const slotId = document.getElementById("slot-id").value;
  const mensagemDiv = document.getElementById("mensagem");

  if (!clienteId || !slotId) return;

  try {
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

