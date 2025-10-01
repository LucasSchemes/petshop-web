# PET shop na WEB

Projeto desenvolvido para a disciplina de Programação Web do curso de graduação da Universidade Federal de Santa Catarina (UFSC), Campus Araranguá

Alunos: Lucas Saft Schemes e Pedro Antonio Tolardo Magnavita
Professor: Fábio Rodrigues de La Rocha
Semestre: 2025.2

## 📜 Descrição

Este projeto consiste em uma plataforma online para agendamento de serviços de banho e tosa em um Pet Shop. A aplicação foi criada para solucionar as dificuldades e a desorganização do agendamento manual, feito por telefone ou mensagens.

A plataforma permite que o Pet Shop defina previamente sua grade de horários disponíveis, enquanto os clientes podem acessar o site, visualizar os slots de tempo livres e escolher o que melhor se encaixa em sua agenda, garantindo uma visão clara e sempre atualizada das opções.

## ✨ Funcionalidades

* **📅 Agenda Semanal para Clientes:** Exibe um calendário semanal onde apenas os slots com vagas disponíveis são mostrados. Horários esgotados (com 0 vagas) ou que já passaram são omitidos.
* **🔢 Vagas por Horário:** Cada slot de tempo exibe um número que indica quantos atendimentos podem ser realizados simultaneamente, de acordo com a disponibilidade de funcionários.
* **🖱️ Agendamento Simplificado:** Um cliente pré-cadastrado pode escolher um horário e confirmar a marcação com o clique de um botão.
* **🔄 Atualização em Tempo Real:** Ao receber um agendamento, o servidor registra a informação no histórico do cliente e atualiza a tabela de horários, decrementando a capacidade do slot correspondente.
* **🖥️ Painel Administrativo:** Para o Pet Shop, existe uma interface exclusiva de visualização dos horários com os nomes dos clientes agendados em cada slot.
* **👤 Cadastro de Clientes:** Uma interface dedicada permite que novos clientes se cadastrem na plataforma.

## 🛠️ Tecnologias Utilizadas

A aplicação foi implementada utilizando as seguintes tecnologias, conforme especificado nos requisitos do trabalho:

* **Back-end:** Node.js, Express
* **Banco de Dados:** MongoDB
* **Front-end:** HTML, CSS e JavaScript (servidos como páginas estáticas pelo Express)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (que inclui o gerenciador de pacotes npm)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community)

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/LucasSchemes/petshop-web.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd petshop-web
    ```

3.  **Instale as dependências do back-end:**
    ```bash
    npm install
    ```

### Execução

1.  **Inicie o serviço do MongoDB:** Certifique-se de que o seu servidor MongoDB esteja em execução na máquina.

2.  **(Opcional) Popule o banco de dados com dados iniciais:**  
    Execute o script de seed (caso exista um arquivo `seed.js`):
    ```bash
    node seed.js
    ```

3.  **Inicie o servidor da aplicação:**
    ```bash
    node server.js 
    ```
    *Substitua `server.js` pelo nome do arquivo principal do seu servidor, se for diferente.*

4.  **Acesse a aplicação no navegador:**
    * **Página do Cliente:** `http://localhost:3000`
    * **Página de Administração:** `http://localhost:3000/admin.html`

    *A porta pode variar se estiver configurada de forma diferente no seu código de back-end.*