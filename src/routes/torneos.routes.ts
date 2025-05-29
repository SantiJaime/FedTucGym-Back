import { Router } from 'express';
import { 
  crearTorneo, 
  obtenerTorneos, 
  obtenerTorneo, 
  actualizarTorneo, 
  eliminarTorneo 
} from '../controllers/torneos.controller';

const router = Router();

router.get('/torneos', obtenerTorneos);
router.get('/torneos/:idTorneo', obtenerTorneo);
router.post('/torneos', crearTorneo);
router.put('/torneos/:idTorneo', actualizarTorneo);
router.delete('/torneos/:idTorneo', eliminarTorneo);

export default router;