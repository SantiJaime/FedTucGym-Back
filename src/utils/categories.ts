export type Categoria =
  | "Pre Mini"
  | "Mini"
  | "Pre Infantil"
  | "Infantil"
  | "Juvenil"
  | "Mayores"
  | "Sin categoría";

export function calcularEdadYCategoriaAl31Dic(birth_date : string): { age: number; category: Categoria } {
  const nacimiento = new Date(birth_date);
  const hoy = new Date();
  const finDeAno = new Date(hoy.getFullYear(), 11, 31);
  let age = finDeAno.getFullYear() - nacimiento.getFullYear();
  const m = finDeAno.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && finDeAno.getDate() < nacimiento.getDate())) {
    age--;
  }

  let category: Categoria = "Sin categoría";
  if (age >= 6 && age <= 7) category = "Pre Mini";
  else if (age >= 8 && age <= 9) category = "Mini";
  else if (age >= 10 && age <= 11) category = "Pre Infantil";
  else if (age >= 12 && age <= 13) category = "Infantil";
  else if (age >= 14 && age <= 15) category = "Juvenil";
  else if (age >= 16) category = "Mayores";

  return { age, category };
}