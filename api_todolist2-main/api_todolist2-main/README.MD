# TODOLIST ✔

Documento de Levantamento de Requisitos: Gerenciamento de Tarefas

### 1. **Visão Geral do Projeto**

O sistema de Gerenciamento de Tarefas visa fornecer uma aplicação backend que permita a criação, atualização, listagem e gestão de tarefas. A aplicação deve ser capaz de controlar o estado das tarefas (pendente ou concluída), bem como fornecer recursos para paginação de resultados e filtragem por status.

---

### 2. **Requisitos Funcionais**

### 2.1. **Tarefas**

- **RF01 - Criar Tarefa**
  - O sistema deve permitir a criação de uma nova tarefa com as seguintes informações:
    - `tarefa` (obrigatório): Nome ou título da tarefa.
    - `descricao` (opcional): Descrição detalhada da tarefa.
    - `status` (automático): Definido como "pendente" por padrão.
  - **Endpoint:** `POST /api/tarefa`
  - **Validação:** Os dados de entrada devem ser validados utilizando o esquema `createSchema`.
- **RF02 - Listar Tarefas com Paginação**
  - O sistema deve permitir a listagem de todas as tarefas com suporte à paginação.
    - A listagem deve incluir:
      - `totalTarefas`: Total de tarefas cadastradas.
      - `totalPaginas`: Número total de páginas.
      - `paginaAtual`: Página atual sendo visualizada.
      - `itemsPorPagina`: Número de tarefas por página.
      - `proximaPagina`: URL para acessar a próxima página, se aplicável.
      - `tarefas`: Lista de tarefas da página atual.
  - **Endpoint:** `GET /api/tarefas`
  - **Parâmetros:**
    - `page` (opcional): Número da página. Valor padrão: `1`.
    - `limit` (opcional): Número de itens por página. Valor padrão: `10`.
- **RF03 - Buscar Tarefa por ID**
  - O sistema deve permitir a busca de uma tarefa específica pelo seu ID.
    - **Validação:** O ID deve ser validado utilizando o esquema `idSchema`.
    - Se a tarefa não for encontrada, o sistema deve retornar uma resposta de `404`.
  - **Endpoint:** `GET /api/tarefas/:id`
- **RF04 - Atualizar Tarefa**
  - O sistema deve permitir a atualização de uma tarefa específica pelo seu ID.
    - Campos que podem ser atualizados:
      - `tarefa`
      - `descricao`
      - `status`
    - **Validação:** O ID e os dados de entrada devem ser validados utilizando os esquemas `getSchema` e `updateTarefaSchema`.
    - Se a tarefa não for encontrada, o sistema deve retornar uma resposta de `404`.
  - **Endpoint:** `PUT /api/tarefas/:id`
- **RF05 - Atualizar Status da Tarefa**
  - O sistema deve permitir a atualização do status de uma tarefa específica pelo seu ID:
    - Se a tarefa estiver com o status "pendente", o status deve ser atualizado para "concluida".
    - Se a tarefa estiver com o status "concluida", o status deve ser atualizado para "pendente".
    - **Validação:** O ID deve ser validado utilizando o esquema `getSchema`.
  - **Endpoint:** `PATCH /api/tarefas/:id/status`
- **RF06 - Buscar Tarefas por Situação**
  - O sistema deve permitir a busca de todas as tarefas filtradas por status ("pendente" ou "concluida").
    - **Validação:** A situação deve ser validada utilizando o esquema `statusSchema`.
  - **Endpoint:** `GET /api/tarefas/status/:status`
- **RF07 - Deletar Tarefas por ID**
  - O sistema deve permitir a excluir uma tarefa específica pelo seu ID.
    - **Validação:** O ID deve ser validado utilizando o esquema `idSchema`.
    - - Se a tarefa não for encontrada, o sistema deve retornar uma resposta de `404`.
  - **Endpoint:** `DELETE /api/tarefas/:id`

---

### 3. **Observações**

- Utilizem esse projeto para praticar seu front-end ou até mesmo o back-end
- O projeto foi construido com SQLite, não se preocupe em baixar um banco de dados
- o arquivo .env está dipónivel para você não se preocupar com variáveis de ambiente

### O projeto foi desenvolvido para fins didáticos

- Qualquer dúvida pode entrar em contato: carlosvasconcelos.dev@gmail.com
