import { Torneo } from '../models/torneos.model';

const torneos: Torneo[] = []; // Simulación de base de datos en memoria

export const obtenerTorneos = (): Torneo[] => {
  return torneos;
};

export const obtenerTorneo = (id: string): Torneo | undefined => {
  return torneos.find(torneo => torneo.id === id);
};

export const crearTorneo = (nuevoTorneo: Torneo): Torneo => {
  torneos.push(nuevoTorneo);
  return nuevoTorneo;
};

export const actualizarTorneo = (id: string, torneoActualizado: Torneo): boolean => {
  const index = torneos.findIndex(torneo => torneo.id === id);
  if (index !== -1) {
    torneos[index] = torneoActualizado;
    return true;
  }
  return false;
};

export const eliminarTorneo = (id: string): boolean => {
  const index = torneos.findIndex(torneo => torneo.id === id);
  if (index !== -1) {
    torneos.splice(index, 1);
    return true;
  }
  return false;
};