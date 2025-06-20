export type Categoria =
  | "Pre Mini"
  | "Mini"
  | "Pre Infantil"
  | "Infantil"
  | "Juvenil"
  | "Mayores"
  | "Sin categoría";

export function calcularEdadYCategoria(fechaNacimiento: string): { edad: number; categoria: Categoria } {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  let categoria: Categoria = "Sin categoría";
  if (edad >= 6 && edad <= 7) categoria = "Pre Mini";
  else if (edad >= 8 && edad <= 9) categoria = "Mini";
  else if (edad >= 10 && edad <= 11) categoria = "Pre Infantil";
  else if (edad >= 12 && edad <= 13) categoria = "Infantil";
  else if (edad >= 14 && edad <= 15) categoria = "Juvenil";
  else if (edad >= 16) categoria = "Mayores";

  return { edad, categoria };
}