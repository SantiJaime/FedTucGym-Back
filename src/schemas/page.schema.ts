import { z } from "zod";

export const PageDTO = z
  .number()
  .int("La página debe ser un número entero")
  .nonnegative("La página no puede ser negativa");
