async function fetchAndRenderSlots() {
    try {
        const response = await fetch("/api/horarios");
        const slots = await response.json();

        const container = document.getElementById("slots-container");
        container.innerHTML = "";

        if (!slots.length) {
            container.innerHTML = "<p>Nenhum horário disponível.</p>";
            return;
        }

        slots.forEach(slot => {
            if (slot.vagas > 0) {
                const btn = document.createElement("button");
                btn.textContent = `${slot.dia} ${slot.hora} (${slot.vagas} vagas)`;
                btn.onclick = () => {
                    document.getElementById("slot-id").value = slot._id;
                };
                container.appendChild(btn);
            }
        });
    } catch (err) {
        console.error("Erro ao carregar slots:", err);
        document.getElementById("slots-container").innerHTML =
            "<p>Erro ao carregar horários.</p>";
    }
}

document.getElementById("agendamento-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const slotId = document.getElementById("slot-id").value;

    if (!slotId) {
        alert("Selecione um horário antes de confirmar!");
        return;
    }

    try {
        const response = await fetch("/api/agendamentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, slotId })
        });

        if (response.ok) {
            alert("Agendamento realizado com sucesso!");
            fetchAndRenderSlots();
        } else {
            alert("Erro ao agendar.");
        }
    } catch (err) {
        console.error("Erro no agendamento:", err);
    }
});

fetchAndRenderSlots();
