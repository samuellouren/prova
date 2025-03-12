import { Request, Response } from 'express';
import { object, z } from 'zod';
import tarefaService from '../services/tarefaService';

const createSchema = z.object({
  titulo: z
    .string({ required_error: 'O titulo é obrigatório' })
    .min(2, { message: 'O título deve conter no mínimo 2 caracteres' }),
});

const idSchema = z.object({
  id: z
    .string({ required_error: 'O identificador é obrigatório' })
    .uuid({ message: 'Identificação inválida' }),
});

const updateTarefaSchema = z.object({
  titulo: z
    .string({ required_error: 'O titulo é obrigatório' })
    .min(2, { message: 'O título deve conter no mínimo 2 caracteres' }),
  descricao: z.string().nullable(),
  status: z.boolean(),
});

const situacaoSchema = z.object({
  status: z.enum(['pendente', 'concluida']),
});

export const createTarefa = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const createValidation = createSchema.safeParse(request.body);
    if (!createValidation.success) {
      response.status(400).json({ err: 'Título é obrigatório' });
      return;
    }

    const titulo = createValidation.data.titulo;
    const descricao = request.body?.descricao;
    const status = 'PENDENTE';

    const tarefaData = {
      titulo,
      descricao,
      status,
    };

    const novaTarefa = await tarefaService.createTarefa(tarefaData);

    response.status(201).json(novaTarefa);
  } catch (error) {
    response.status(500).json({ message: 'Erro ao criar tarefa' });
  }
};

export const getAllTarefas = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const pagina = request.query.pagina || 1;
  const porPagina = request.query.porPagina || 10;

  //converter
  const numeroDaPagina = parseInt(pagina as string, 10);
  const quantidadePorPagina = parseInt(porPagina as string, 10);

  try {
    const tarefas = await tarefaService.getAllTarefas(
      numeroDaPagina,
      quantidadePorPagina,
    );

    response.status(200).json(tarefas);
  } catch (error) {
    console.error(error);
    response.status(500).json({ err: 'Erro ao listar Tarefas' });
  }
};

export const getTarefa = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const idValidation = idSchema.safeParse(request.params);
    if (!idValidation.success) {
      response.status(400).json({ err: 'O id é obrigatório' });
      return;
    }

    const id = idValidation.data.id;

    const tarefa = await tarefaService.getTarefa(id);

    response.status(200).json(tarefa);
  } catch (error) {
    response.status(500).json({ err: 'Erro ao buscar tarefa' });
  }
};

export const updateTarefa = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const idValidation = idSchema.safeParse(request.params);
    if (!idValidation.success) {
      response.status(400).json({ err: idValidation.error });
      return;
    }
    const updateTarefaValidation = updateTarefaSchema.safeParse(request.body);
    if (!updateTarefaValidation.success) {
      response.status(400).json({ err: updateTarefaValidation.error });
      return;
    }

    const { id } = idValidation.data;
    const { titulo, descricao, status } = updateTarefaValidation.data;

    const updateTarefa = {
      titulo,
      descricao,
      status,
    };

    const tarefaAtualizada = await tarefaService.updateTafefa(id, updateTarefa);
    response
      .status(200)
      .json({ message: 'Tarefa Atualizada', tarefaAtualizada });
  } catch (error) {
    response.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
};

export const updateStatusTarefa = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const idValidation = idSchema.safeParse(request.params);
  if (!idValidation.success) {
    response.status(400).json({ err: idValidation.error });
    return;
  }
  const id = idValidation.data.id;
  try {
    const updateStatus = await tarefaService.updateStatusTarefa(id);

    response.status(200).json(updateStatus);
  } catch (error) {
    console.error('Erro ===> ', error);
    response.status(200).json({ message: 'Atualizar status de ratefa' });
    return;
  }
};

export const getTarefaPorSituacao = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const situacaoValidation = situacaoSchema.safeParse(request.params);
  if (!situacaoValidation.success) {
    response.status(400).json({ error: 'Status inválido' });
    return;
  }

  const situacao = situacaoValidation.data?.status.toLocaleUpperCase();
  try {
    const tarefaSituacao = await tarefaService.getTarefaPorSituacao(situacao);
    response.status(200).json(tarefaSituacao);
  } catch (error) {
    response.status(500).json({ message: 'Erro ao buscar status' });
    return;
  }
};

export const deleteTarefa = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const idValidation = idSchema.safeParse(request.params);
    if (!idValidation.success) {
      response.status(400).json({ err: 'O id é obrigatório' });
      return;
    }

    const id = idValidation.data.id;

    await tarefaService.deteleTarefa(id);

    response.status(204).send();
  } catch (error) {
    response.status(500).json({ err: 'Erro ao buscar tarefa' });
  }
};
