// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    // ID do cliente pré-cadastrado (exemplo)
    // Em um sistema real, isso viria de um login.
    const CLIENT_ID_EXEMPLO = 'cliente123'; 

    /**
     * Busca os horários disponíveis na API e renderiza a tabela.
     */
    async function fetchAndRenderSlots() {
        try {
            const response = await fetch('/api/slots/disponiveis');
            if (!response.ok) {
                throw new Error('Falha ao buscar os horários.');
            }
            const scheduleData = await response.json();
            renderSchedule(scheduleData);
        } catch (error) {
            scheduleContainer.innerHTML = `<p style="color: red;">Erro ao carregar a agenda: ${error.message}</p>`;
            console.error('Erro:', error);
        }
    }

    /**
     * Renderiza a tabela de horários com base nos dados recebidos.
     * @param {object} scheduleData - Objeto com os dias da semana e seus horários.
     */
    function renderSchedule(scheduleData) {
        // Limpa o container antes de renderizar
        scheduleContainer.innerHTML = '';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const days = Object.keys(scheduleData); // ["Segunda", "Terça", ...]
        const times = Object.keys(scheduleData[days[0]]); // ["8:00", "9:00", ...]

        // Cria o cabeçalho da tabela (Horário, Segunda, Terça, ...)
        const headerRow = document.createElement('tr');
        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Horário';
        headerRow.appendChild(timeHeader);
        days.forEach(day => {
            const dayHeader = document.createElement('th');
            dayHeader.textContent = day;
            headerRow.appendChild(dayHeader);
        });
        thead.appendChild(headerRow);

        // Cria as linhas da tabela com os horários e botões
        times.forEach(time => {
            const bodyRow = document.createElement('tr');
            
            const timeCell = document.createElement('td');
            timeCell.textContent = time;
            bodyRow.appendChild(timeCell);

            days.forEach(day => {
                const slotCell = document.createElement('td');
                const availableSlots = scheduleData[day][time];

                [cite_start]// Apenas exibe o slot se houver vagas (> 0) [cite: 20]
                if (availableSlots > 0) {
                    const button = document.createElement('button');
                    button.className = 'slot-button';
                    [cite_start]// Exibe o número de vagas disponíveis no botão [cite: 16]
                    button.textContent = `Agendar (${availableSlots} vagas)`;
                    button.addEventListener('click', () => bookSlot(day, time));
                    slotCell.appendChild(button);
                } else {
                    // Adiciona uma classe para estilizar células vazias se necessário
                    slotCell.className = 'empty-slot'; 
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
     * Realiza o agendamento de um horário via API.
     * @param {string} day - O dia da semana selecionado.
     * @param {string} time - O horário selecionado.
     */
    async function bookSlot(day, time) {
        // Confirmação do usuário
        const confirmed = confirm(`Você deseja agendar o serviço para ${day} às ${time}?`);
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch('/api/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clienteId: CLIENT_ID_EXEMPLO,
                    dia: day,
                    horario: time
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Não foi possível concluir o agendamento.');
            }

            alert('Agendamento realizado com sucesso!');
            
            [cite_start]// Atualiza a tabela de horários para refletir a nova disponibilidade [cite: 24]
            fetchAndRenderSlots();

        } catch (error) {
            alert(`Erro no agendamento: ${error.message}`);
            console.error('Erro ao agendar:', error);
        }
    }

    // Carrega os horários assim que a página é aberta
    fetchAndRenderSlots();
});