// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener("DOMContentLoaded", () => {
    const scheduleContainer = document.getElementById("schedule-container");
    const CLIENT_ID_EXEMPLO = "cliente123"; // em sistema real viria do login

    /**
     * Busca os horários disponíveis no backend e monta a tabela.
     */
    async function fetchAndRenderSlots() {
        try {
            const res = await fetch("/api/slots");
            if (!res.ok) throw new Error("Erro ao buscar slots");
            const scheduleData = await res.json();

            renderSchedule(scheduleData);
        } catch (err) {
            console.error("Erro ao carregar slots:", err);
            scheduleContainer.innerHTML =
                "<p>Erro ao carregar os horários disponíveis.</p>";
        }
    }

    /**
     * Renderiza a tabela de horários com base nos dados recebidos.
     * @param {object} scheduleData - Objeto no formato { "Segunda": { "8:00": 2, ... }, ... }
     */
    function renderSchedule(scheduleData) {
        scheduleContainer.innerHTML = "";

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        const days = Object.keys(scheduleData);
        const times = Object.keys(scheduleData[days[0]]);

        // Cabeçalho
        const headerRow = document.createElement("tr");
        const timeHeader = document.createElement("th");
        timeHeader.textContent = "Horário";
        headerRow.appendChild(timeHeader);

        days.forEach((day) => {
            const dayHeader = document.createElement("th");
            dayHeader.textContent = day;
            headerRow.appendChild(dayHeader);
        });
        thead.appendChild(headerRow);

        // Linhas de horários
        times.forEach((time) => {
            const bodyRow = document.createElement("tr");

            const timeCell = document.createElement("td");
            timeCell.textContent = time;
            bodyRow.appendChild(timeCell);

            days.forEach((day) => {
                const slotCell = document.createElement("td");
                const availableSlots = scheduleData[day][time];

                // Apenas exibe se houver vagas
                if (availableSlots > 0) {
                    const button = document.createElement("button");
                    button.className = "slot-button";
                    button.textContent = `Agendar (${availableSlots} vagas)`;
                    button.addEventListener("click", () => bookSlot(day, time));
                    slotCell.appendChild(button);
                } else {
                    slotCell.className = "empty-slot";
                }

                bodyRow.appendChild(slotCell);
            });

            tbody.appendChild(bodyRow);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        scheduleContainer.appendChild(table);
    }

    /**
     * Envia solicitação de agendamento ao backend.
     * @param {string} day - Dia selecionado
     * @param {string} time - Horário selecionado
     */
    async function bookSlot(day, time) {
        const confirmed = confirm(
            `Você deseja agendar o serviço para ${day} às ${time}?`
        );
        if (!confirmed) return;

        try {
            const response = await fetch("/api/agendamentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clienteId: CLIENT_ID_EXEMPLO,
                    dia: day,
                    horario: time,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Não foi possível concluir o agendamento."
                );
            }

            alert("Agendamento realizado com sucesso!");
            fetchAndRenderSlots(); // atualiza tabela
        } catch (error) {
            alert(`Erro no agendamento: ${error.message}`);
            console.error("Erro ao agendar:", error);
        }
    }

    // Carrega os horários ao abrir a página
    fetchAndRenderSlots();
});
