import prisma from '../config/prisma';
import { ITarefa } from '../interfaces/ITarefa';

enum Status {
  CONCLUIDA = 'CONCLUIDA',
  PENDENTE = 'PENDENTE',
}
class TarefaServices {
  public createTarefa = async (tarefaData: ITarefa): Promise<ITarefa> => {
    try {
      const tarefa = await prisma.tarefa.create({
        data: tarefaData,
      });
      return tarefa;
    } catch (error) {
      throw new Error('Erro ao cadastrar Produto');
    }
  };

  public getAllTarefas = async (
    pagina: number,
    porPagina: number,
  ): Promise<{
    meta: {
      total: number;
      totalpaginas: number;
      pagina: number;
      porPagina: number;
    };
    data: ITarefa[];
  }> => {
    const skip = (pagina - 1) * porPagina;
    const take = porPagina;

    try {
      const tarefas = await prisma.tarefa.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalTarefas = await prisma.tarefa.count();

      return {
        meta: {
          total: totalTarefas,
          totalpaginas: Math.ceil(totalTarefas / porPagina),
          pagina,
          porPagina,
        },
        data: tarefas,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar Tarefas');
    }
  };

  public getTarefa = async (tarefaId: string): Promise<ITarefa> => {
    try {
      const tarefa = await prisma.tarefa.findFirst({ where: { id: tarefaId } });
      if (!tarefa) {
        throw new Error(`Tarefa não encontrado`);
      }
      return tarefa;
    } catch (error) {
      throw new Error('Erro ao buscar tarefa: ' + tarefaId);
    }
  };

  public updateTafefa = async (
    tarefaId: string,
    tarefaData: ITarefa,
  ): Promise<ITarefa | null> => {
    try {
      const tarefaAtualizada = await prisma.tarefa.update({
        where: { id: tarefaId },
        data: tarefaData,
      });

      return tarefaAtualizada;
    } catch (error) {
      throw new Error('Erro ao Atualizar tarefa');
    }
  };

  public updateStatusTarefa = async (tarefaId: string): Promise<ITarefa> => {
    try {
      const encontrarTarefa = await prisma.tarefa.findUnique({
        where: { id: tarefaId },
      });

      if (!encontrarTarefa) {
        throw new Error('Tarefa não encontrada');
      }

      if (encontrarTarefa?.status === Status.CONCLUIDA) {
        const updateStatus = await prisma.tarefa.update({
          data: { status: Status.PENDENTE },
          where: { id: tarefaId },
        });
        return updateStatus;
      } else {
        const updateStatus = await prisma.tarefa.update({
          data: { status: Status.CONCLUIDA },
          where: { id: tarefaId },
        });
        return updateStatus;
      }
    } catch (error) {
      throw new Error('Erro ao Atualizar status da tarefa');
    }
  };

  public getTarefaPorSituacao = async (
    tarefaSituation: string,
  ): Promise<ITarefa[]> => {
    console.log(tarefaSituation);
    try {
      const tarefaPorSituacao = await prisma.tarefa.findMany({
        where: { status: tarefaSituation },
      });
      return tarefaPorSituacao;
    } catch (error) {
      throw new Error('Erro ao listar tarefa por situação');
    }
  };

  public deteleTarefa = async (tarefaId: string): Promise<ITarefa> => {
    console.log(tarefaId);
    try {
      const excluirTarefa = await prisma.tarefa.delete({
        where: { id: tarefaId },
      });
      return excluirTarefa;
    } catch (error) {
      throw new Error('Erro ao excluir uma tarefa');
    }
  };
}

export default new TarefaServices();
