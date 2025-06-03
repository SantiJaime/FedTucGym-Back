import type { ZodIssue } from 'zod';

export const parseToDateRange = (startDate: string, endDate: string): string => {
  return `[${startDate},${endDate})`;
}

export const parseErrors = (errors: ZodIssue[]) => {
  return errors
    .map((error) => `${error.path} ${error.message}`)
    .join(", ");
}