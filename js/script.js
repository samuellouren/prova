// URL base da API
const API_URL = "http://localhost:3333/api"; 

// Função para buscar todas as tarefas (opcionalmente com filtro via query parameter)
async function getTarefas(filtro = "") { 
  try { 
    // Construção da URL: se houver filtro, usamos query parameter; caso contrário, a rota padrão
    let url = `${API_URL}/tarefas`;
    if (filtro) {
      url += `?filtro=${encodeURIComponent(filtro)}`;
    }
    console.log("URL para requisição:", url);
    
    const response = await fetch(url); 
    if (!response.ok) {
      throw new Error(`Erro ao buscar tarefas: ${response.status}`);
    }
    
    const data = await response.json(); 
    console.log("Dados recebidos da API:", data); 
    
    // Verifica se a resposta é um array ou se vem em alguma propriedade (tarefas ou data)
    if (Array.isArray(data)) {
      return data;
    } else if (data.tarefas && Array.isArray(data.tarefas)) {
      return data.tarefas;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    console.warn("Formato de dados inesperado:", data);
    return []; 
  } catch (error) { 
    console.error(error);
    mostrarMensagem(`Erro ao buscar tarefas: ${error.message}`, true);
    return []; 
  } 
}

// Função para adicionar uma nova tarefa
async function addTarefa(titulo, descricao) { 
  try { 
    if (!titulo || titulo.trim() === "") {
      mostrarMensagem("Título é obrigatório", true);
      return null;
    }
    
    const novaTarefaData = {
      titulo: titulo,
      descricao: descricao || ""
    };
    
    console.log("Enviando dados para nova tarefa:", novaTarefaData);
    
    const response = await fetch(`${API_URL}/tarefas`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(novaTarefaData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro ao adicionar tarefa: ${response.status}`, errorData);
      throw new Error(`Erro ao adicionar tarefa: ${errorData.err || response.status}`);
    }
    
    const novaTarefa = await response.json();
    console.log("Tarefa adicionada:", novaTarefa);
    mostrarMensagem("Tarefa adicionada com sucesso!");
    return novaTarefa;
  } catch (error) {
    console.error("Erro ao adicionar tarefa", error);
    mostrarMensagem(`Erro ao adicionar tarefa: ${error.message}`, true);
    return null;
  }
}

// Função para excluir uma tarefa
async function deleteTarefa(id) {
  try {
    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir tarefa: ${response.status}`);
    }
    mostrarMensagem("Tarefa excluída com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao excluir tarefa", error);
    mostrarMensagem(`Erro ao excluir tarefa: ${error.message}`, true);
    return false;
  }
}

// Função para marcar uma tarefa como concluída (usando endpoint PATCH específico)
async function concluirTarefa(id) {
  try {
    const response = await fetch(`${API_URL}/tarefas/${id}/status`, {
      method: "PATCH"
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar status da tarefa: ${response.status}`);
    }
    mostrarMensagem("Status da tarefa atualizado com sucesso!");
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar status da tarefa", error);
    mostrarMensagem(`Erro ao atualizar status: ${error.message}`, true);
    return null;
  }
}

// Função para atualizar uma tarefa existente (envia título, descrição e status)
async function updateTarefa(id, titulo, descricao, status) { 
  try { 
    // Converte o status para booleano: true se for "CONCLUIDA", false caso contrário
    const statusBoolean = typeof status === "boolean" ? status : String(status).toUpperCase() === "CONCLUIDA";
    const tarefaAtualizada = { 
      titulo: titulo,
      descricao: descricao || "",
      status: statusBoolean
    }; 
    
    console.log("Dados enviados para atualização:", tarefaAtualizada);

    const response = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefaAtualizada)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro ao atualizar tarefa: ${response.status}`, errorData);
      throw new Error(`Erro ao atualizar tarefa: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    mostrarMensagem("Tarefa atualizada com sucesso!");
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar tarefa", error);
    mostrarMensagem(`Erro ao atualizar tarefa: ${error.message}`, true);
    return null;
  }
}

// Função para buscar uma tarefa pelo ID
async function getTarefaById(id) { 
  try { 
    const response = await fetch(`${API_URL}/tarefas/${id}`); 
    if (!response.ok) {
      throw new Error(`Erro ao buscar tarefa por ID: ${response.status}`);
    }
    return await response.json(); 
  } catch (error) { 
    console.error("Erro ao buscar tarefa por ID", error);
    return null;
  } 
}

// Função para mostrar mensagens de sucesso ou erro
function mostrarMensagem(texto, isError = false) {
  const mensagemElement = document.getElementById("mensagem");
  if (!mensagemElement) return;
  
  mensagemElement.textContent = texto;
  mensagemElement.classList.remove("mensagem--erro", "mensagem--sucesso");
  mensagemElement.classList.add(isError ? "mensagem--erro" : "mensagem--sucesso");
  mensagemElement.style.display = "block";
  
  setTimeout(function() {
    mensagemElement.style.display = "none";
  }, 3000);
}

// Quando a página carrega
document.addEventListener("DOMContentLoaded", function() { 
  const form = document.getElementById("form"); 
  const listaTarefas = document.getElementById("list"); 
  const pesquisaForm = document.getElementById("form_pesq"); 
  let tarefaEditando = null;
  const btnCadastrar = document.querySelector(".form_buttoncadastro");

  // Carrega as tarefas e, se houver filtro, aplica a filtragem local pelo título
  async function carregarTarefas(filtro = "") {
    listaTarefas.innerHTML = "<p>Carregando tarefas...</p>";
    const todasTarefas = await getTarefas();
    let tarefasFiltradas = todasTarefas;
    if (filtro) {
      tarefasFiltradas = todasTarefas.filter(tarefa =>
        tarefa.titulo.toLowerCase().includes(filtro.toLowerCase())
      );
    }
    listaTarefas.innerHTML = "";
    if (!tarefasFiltradas || tarefasFiltradas.length === 0) {
      listaTarefas.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
      return;
    }
    tarefasFiltradas.forEach(tarefa => criarCardTarefa(tarefa));
  }

  function criarCardTarefa(tarefa) {
    if (!tarefa || !tarefa.id) {
      console.error("Tarefa inválida:", tarefa);
      return;
    }
    console.log("Criando card para tarefa:", tarefa);
    const card = document.createElement("article");
    card.classList.add("card");
    const statusConcluido = tarefa.status && String(tarefa.status).toUpperCase().startsWith("CONCLU");
    console.log("Status da tarefa:", tarefa.status, "Está concluída?", statusConcluido);
    
    card.innerHTML = `
      <header class="card_header">
        <h1 class="card_titulo">${tarefa.titulo || "Sem título"}</h1>
        <h5 class="${statusConcluido ? "card_statusok" : "card_status"}">
          ${statusConcluido ? "Concluída" : "Pendente"}
        </h5>
      </header>
      <section class="card_body">
        <p class="card_descricao">${tarefa.descricao || ""}</p>
      </section>
      <footer class="card_footer">
        <button class="card_button card_button--edit" data-id="${tarefa.id}">Editar</button>
        <button class="card_button card_button--delete" data-id="${tarefa.id}">Excluir</button>
        ${!statusConcluido ? `<button class="card_button card_button--ok" data-id="${tarefa.id}">Concluir</button>` : ""}
      </footer>
    `;
    
    listaTarefas.appendChild(card);
  }

  // Configura o formulário para edição ou cadastro
  function configurarFormulario(tarefa = null) {
    const nameInput = document.getElementById("name");
    const descricaoInput = document.getElementById("descricao");
    
    if (tarefa) {
      nameInput.value = tarefa.titulo || "";
      descricaoInput.value = tarefa.descricao || "";
      btnCadastrar.textContent = "Atualizar";
      tarefaEditando = tarefa;
    } else {
      form.reset();
      btnCadastrar.textContent = "Cadastrar";
      tarefaEditando = null;
    }
  }

  // Evento do formulário de cadastro/atualização
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const titulo = document.getElementById("name").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!titulo) {
      mostrarMensagem("Por favor, informe pelo menos o título da tarefa.", true);
      return;
    }

    try {
      if (tarefaEditando) {
        await updateTarefa(tarefaEditando.id, titulo, descricao, tarefaEditando.status);
      } else {
        await addTarefa(titulo, descricao);
      }
      console.log("Chamando carregarTarefas após adicionar/atualizar tarefa");
      await carregarTarefas();
      configurarFormulario();
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      mostrarMensagem(`Erro ao processar formulário: ${error.message}`, true);
    }
  });

  // Manipulação dos botões dos cards (editar, excluir, concluir)
  listaTarefas.addEventListener("click", async function(e) {
    if (e.target.tagName === "BUTTON") e.preventDefault();
    
    if (!e.target.classList.contains("card_button--edit") &&
        !e.target.classList.contains("card_button--delete") &&
        !e.target.classList.contains("card_button--ok")) {
      return;
    }
    
    const id = e.target.getAttribute("data-id");
    if (!id) return;

    try {
      if (e.target.classList.contains("card_button--delete")) {
        if (confirm("Deseja realmente excluir esta tarefa?")) {
          await deleteTarefa(id);
          await carregarTarefas();
        }
      } else if (e.target.classList.contains("card_button--ok")) {
        const tarefaAtualizada = await concluirTarefa(id);
        console.log("Tarefa atualizada após conclusão:", tarefaAtualizada);
        await carregarTarefas();
      } else if (e.target.classList.contains("card_button--edit")) {
        const tarefa = await getTarefaById(id);
        if (tarefa) {
          configurarFormulario(tarefa);
        } else {
          mostrarMensagem("Não foi possível carregar os dados da tarefa.", true);
        }
      }
    } catch (error) {
      console.error("Erro ao processar ação:", error);
      mostrarMensagem(`Erro ao processar ação: ${error.message}`, true);
    }
  });

  // Evento do formulário de pesquisa
  // Se o valor digitado tiver 36 caracteres, tratamos como ID; caso contrário, filtramos localmente pelo título
  pesquisaForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const filtro = document.getElementById("pesquisa").value.trim();
    
    if (filtro && filtro.length === 36) {
      console.log("Pesquisando por ID:", filtro);
      const tarefa = await getTarefaById(filtro);
      listaTarefas.innerHTML = "";
      if (tarefa) {
        criarCardTarefa(tarefa);
      } else {
        listaTarefas.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
      }
    } else {
      console.log("Pesquisando por filtro genérico:", filtro);
      await carregarTarefas(filtro);
    }
  });

  // Eventos dos botões de filtro de status
  document.getElementById("btn-all").addEventListener("click", async () => {
    // Exibe todas as tarefas
    await carregarTarefas();
  });

  document.getElementById("btn-pendentes").addEventListener("click", async () => {
    // Busca todas as tarefas e filtra as pendentes (aquelas que não têm status iniciando com "CONCLU")
    const todasTarefas = await getTarefas();
    const pendentes = todasTarefas.filter(tarefa => {
      return !(tarefa.status && String(tarefa.status).toUpperCase().startsWith("CONCLU"));
    });
    listaTarefas.innerHTML = "";
    if (pendentes.length === 0) {
      listaTarefas.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
    } else {
      pendentes.forEach(tarefa => criarCardTarefa(tarefa));
    }
  });

  document.getElementById("btn-concluidas").addEventListener("click", async () => {
    // Busca todas as tarefas e filtra as concluídas (status que iniciam com "CONCLU")
    const todasTarefas = await getTarefas();
    const concluidas = todasTarefas.filter(tarefa => {
      return tarefa.status && String(tarefa.status).toUpperCase().startsWith("CONCLU");
    });
    listaTarefas.innerHTML = "";
    if (concluidas.length === 0) {
      listaTarefas.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
    } else {
      concluidas.forEach(tarefa => criarCardTarefa(tarefa));
    }
  });

  // Carrega as tarefas ao iniciar a página
  carregarTarefas();
});
