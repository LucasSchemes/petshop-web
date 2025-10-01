// Função assíncrona para buscar e exibir todos os agendamentos na página de administração.
async function fetchAgendamentos() {
    try {
        // Faz uma requisição GET para a API que retorna a lista de todos os agendamentos.
        const response = await fetch("/api/agendamentos");
        // Converte o corpo da resposta em formato JSON. O resultado será um array de objetos.
        const agendamentos = await response.json();

        const container = document.getElementById("agendamentos-container");
        container.innerHTML = "";

        if (!agendamentos.length) {
            container.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
            return;
        }
        // ordenar agendamentos por data e hora
        agendamentos.forEach(a => {
            const div = document.createElement("div");
            div.classList.add("agendamento");
            div.innerHTML = `<strong>${a.dia} ${a.hora}</strong> - Cliente: ${a.nome}`;
            container.appendChild(div);
        });
    } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
    }
}

fetchAgendamentos();
