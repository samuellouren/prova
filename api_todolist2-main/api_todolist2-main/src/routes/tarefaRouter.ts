import { Router } from 'express';
import {
  createTarefa,
  getAllTarefas,
  getTarefa,
  updateTarefa,
  updateStatusTarefa,
  getTarefaPorSituacao,
  deleteTarefa,
} from '../controllers/tarefaController';

const router = Router();

router.post('/', createTarefa);
router.get('/', getAllTarefas);
router.get('/:id', getTarefa);
router.put('/:id', updateTarefa);
router.patch('/:id/status', updateStatusTarefa);
router.get('/status/:status', getTarefaPorSituacao);
router.delete('/:id', deleteTarefa);

export default router;
