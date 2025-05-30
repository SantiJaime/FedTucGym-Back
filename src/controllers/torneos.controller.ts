import type { Request, Response } from 'express';
import TorneoService from '../services/torneos.service';

const torneoService = new TorneoService();

export const obtenerTorneos = (req: Request, res: Response): void => {};
export const obtenerTorneo = (req: Request, res: Response): void => {};
export const crearTorneo = (req: Request, res: Response): void => {};
export const actualizarTorneo = (req: Request, res: Response): void => {};
export const eliminarTorneo = (req: Request, res: Response): void => {};