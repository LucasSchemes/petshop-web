document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('admin-schedule-container');

    // Horários e dias fixos para montar a grade da agenda
    // Baseado na tabela do documento do trabalho
    const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const HORARIOS = ["8:00", "9:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    /**
     * Busca os agendamentos e monta a tabela de visualização.
     */
    async function fetchAndRenderAdminSchedule() {
        try {
            const response = await fetch('/api/agendamentos');
            if (!response.ok) {
                throw new Error('Falha ao buscar a lista de agendamentos.');
            }
            // agendamentos = [{ clienteNome: 'Ana', dia: 'Terça', horario: '9:00' }, ...]
            const agendamentos = await response.json();
            renderAdminTable(agendamentos);
        } catch (error) {
            scheduleContainer.innerHTML = `<p style="color: red;">Erro ao carregar a agenda: ${error.message}</p>`;
            console.error('Erro:', error);
        }
    }

    /**
     * Cria uma estrutura de dados organizada para a agenda.
     * @returns {object} Um objeto representando a grade de horários vazia.
     */
    function createScheduleGrid() {
        const grid = {};
        DIAS_SEMANA.forEach(dia => {
            grid[dia] = {};
            HORARIOS.forEach(horario => {
                grid[dia][horario] = 'Livre'; // Valor padrão para horário vago
            });
        });
        return grid;
    }

    /**
     * Renderiza a tabela da agenda do Pet Shop com os nomes dos clientes.
     * @param {Array} agendamentos - A lista de agendamentos vinda da API.
     */
    function renderAdminTable(agendamentos) {
        scheduleContainer.innerHTML = '';
        const scheduleGrid = createScheduleGrid();

        // Preenche a grade com os nomes dos clientes dos agendamentos
        agendamentos.forEach(agendamento => {
            // Supondo que o objeto de agendamento tenha `dia`, `horario` e `clienteNome`
            if (scheduleGrid[agendamento.dia] && scheduleGrid[agendamento.dia][agendamento.horario]) {
                scheduleGrid[agendamento.dia][agendamento.horario] = agendamento.clienteNome;
            }
        });

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Cria o cabeçalho (Horário, Segunda, Terça, ...)
        const headerRow = document.createElement('tr');
        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Horário';
        headerRow.appendChild(timeHeader);
        DIAS_SEMANA.forEach(dia => {
            const dayHeader = document.createElement('th');
            dayHeader.textContent = dia;
            headerRow.appendChild(dayHeader);
        });
        thead.appendChild(headerRow);

        // Cria as linhas da tabela
        HORARIOS.forEach(horario => {
            const bodyRow = document.createElement('tr');
            const timeCell = document.createElement('td');
            timeCell.textContent = horario;
            bodyRow.appendChild(timeCell);

            DIAS_SEMANA.forEach(dia => {
                const slotCell = document.createElement('td');
                const clientName = scheduleGrid[dia][horario];

                if (clientName !== 'Livre') {
                    slotCell.textContent = clientName;
                    slotCell.className = 'booked-slot'; // Horário agendado
                } else {
                    slotCell.textContent = '---';
                    slotCell.className = 'free-slot'; // Horário livre
                }
                bodyRow.appendChild(slotCell);
            });
            tbody.appendChild(bodyRow);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        scheduleContainer.appendChild(table);
    }

    // Inicia o processo ao carregar a página
    fetchAndRenderAdminSchedule();
});