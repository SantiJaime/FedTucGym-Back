import type { ZodIssue } from "zod";
import type { MembersFilter } from "../schemas/members.shema";

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
export const toNumberOrUndefined = (val: any) =>
  val === undefined ? undefined : Number(val);

export const parseFilters = (filters: MembersFilter, gymId: number) => {
  let baseQuery = "SELECT * FROM members_view WHERE id_gym = $1";
  let values: any[] = [gymId];
  let conditions: string[] = [];

  if (filters.full_name) {
    conditions.push(`full_name ILIKE $${values.length + 1}`);
    values.push(`%${filters.full_name}%`);
  }

  if (filters.id_category) {
    conditions.push(`id_category = $${values.length + 1}`);
    values.push(filters.id_category);
  }

  if (filters.id_level) {
    conditions.push(`id_level = $${values.length + 1}`);
    values.push(filters.id_level);
  }
  if (filters.dni) {
    conditions.push(`dni = $${values.length + 1}`);
    values.push(filters.dni);
  }

  const query =
    values.length > 1
      ? baseQuery + " AND " + conditions.join(" AND ") + " ORDER BY id ASC"
      : baseQuery;
  console.log(query, values);
  return { query, values };
};
