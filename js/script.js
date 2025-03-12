const API_URL = "http://localhost:3333/api";

async function getTarefas(filtro = "") {
    const response = await fetch(`${API_URL}/${filtro}`);
    return await response.json();
}

async function addTarefa(titulo, descricao) {
    const response = await fetch(`${API_URL}/tarefas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo : titulo,
            status: false ,
            description : descricao
        }),
    });
    return await response.json();
}

async function updateTarefa(id, titulo, descricao) {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo: titulo,
            description: descricao,
            status: false 
        }),
    });
    return await response.json();
}

async function deleteTarefa(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

async function getTarefaById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const listaTarefas = document.getElementById("list");
    const pesquisaForm = document.getElementById("form_pesq");

    let tarefaEditando = null; 

    async function carregarTarefas(filtro = "tarefa") {
        listaTarefas.innerHTML = "";
        const tarefa = await getTarefas(filtro);
        tarefa.forEach(tarefa => criarCardTarefa(tarefa));
    }
    function criarCardTarefa(tarefa) {
        const card = document.createElement("article");
        card.classList.add("card");

        card.innerHTML = `
        <header class="card_header">
            <h1 class="card_titulo">${tarefa.titulo}</h1>
            <h5 class="${tarefa.status ? "card_statusok" : "card_status"}">${tarefa.completed ? "Concluída" : "Pendente"}</h5>
        </header>
        <section class="card_body">
            <p class="card_descricao">${tarefa.description}</p>
        </section>
        <footer class="card_footer">
            <button class="card_button card_button--edit" data-id="${tarefa.id}">Editar</button>
            <button class="card_button card_button--delete" data-id="${tarefa.id}">Excluir</button>  
            <button class="card_button card_button--ok" data-id="${tarefa.id}">Concluir</button>
        </footer>
        `;
        listaTarefas.appendChild(card);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const titulo = document.getElementById("name").value;
        const descricao = document.getElementById("descricao").value;

        if (titulo && descricao) {
            if (tarefaEditando) {
                await updateTarefa(tarefaEditando.id, titulo, descricao);
            } else {
                await addTarefa(titulo, descricao);
            }
            carregarTarefas();
            form.reset();
            tarefaEditando = null;
        }
    });

    listaTarefas.addEventListener("click", async (e) => {
        e.preventDefault();

        const id = e.target.getAttribute("data-id");
        if (!id) return;

        if (e.target.classList.contains("card_button--delete")) {
            await deleteTarefa(id);
            carregarTarefas();
        } else if (e.target.classList.contains("card_button--ok")) {
            await updateTarefa(id, "concluída");
            carregarTarefas();
        } else if (e.target.classList.contains("card_button--edit")) {
            const tarefa = await getTarefaById(id);
            document.getElementById("name").value = tarefa.titulo;
            document.getElementById("descricao").value = tarefa.description;
            tarefaEditando = tarefa;
        }
    });

    pesquisaForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const filtro = document.getElementById("pesquisa").value;
        carregarTarefas(filtro);
    });

    carregarTarefas();
});

