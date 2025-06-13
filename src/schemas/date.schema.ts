import { z } from "zod";

const validateDateFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const validateDateNotPast = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const DateDTO = z
  .string()
  .refine(validateDateFormat, {
    message: "La fecha debe tener el formato YYYY-MM-DD",
  })
  .refine(validateDateNotPast, {
    message: "La fecha no puede ser pasada",
  });

export type DateType = z.infer<typeof DateDTO>;
