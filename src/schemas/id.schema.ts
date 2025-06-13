import { z } from 'zod';

export const IdDTO = z
  .number()
  .int("El ID debe ser un número entero")
  .nonnegative("El ID no puede ser negativo");