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

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const actualMonth = today.getMonth();
  const birthMonth = birth.getMonth();

  const actualDay = today.getDate();
  const birthDay = birth.getDate();

  if (
    actualMonth < birthMonth ||
    (actualMonth === birthMonth && actualDay < birthDay)
  ) {
    age--;
  }
  return age;
};

export const assignCategory = (age: number): string => {
  const CATEGORIES = [
    { min: 6, max: 7, name: "Pre Mini" },
    { min: 8, max: 9, name: "Mini" },
    { min: 10, max: 11, name: "Pre infantil" },
    { min: 12, max: 13, name: "Infantil" },
    { min: 14, max: 15, name: "Juvenil" },
    { min: 16, max: Infinity, name: "Mayores" },
  ];

  const category = CATEGORIES.find((cat) => age >= cat.min && age <= cat.max);
  return category ? category.name : "Sin categoría";
};
