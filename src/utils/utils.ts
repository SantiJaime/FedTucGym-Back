import type { ZodIssue } from "zod";

interface Dates {
  startDate: string;
  endDate: string;
}

export const formatDateForDaterange = ({ startDate, endDate }: Dates): string =>
  `${startDate} | ${endDate}`;

export const subtractDays = (dateStr: string, days: number = 10): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

export const parseErrors = (errors: ZodIssue[]) => {
  return errors.map((error) => `${error.path}: ${error.message}`).join(" | ");
};