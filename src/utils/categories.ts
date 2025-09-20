type Category = {
  id: CategoryID;
  min: number;
  max: number;
};

export function calcularEdadYCategoriaAl31Dic(birth_date: string): {
  age: number;
  id_category: CategoryID;
} {
  const nacimiento = new Date(birth_date);
  const hoy = new Date();
  const finDeAno = new Date(hoy.getFullYear(), 11, 31);
  let age = finDeAno.getFullYear() - nacimiento.getFullYear();
  const m = finDeAno.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && finDeAno.getDate() < nacimiento.getDate())) {
    age--;
  }
  const CATEGORIES: Category[] = [
    { id: 1, min: 6, max: 7 },
    { id: 2, min: 8, max: 9 },
    { id: 3, min: 10, max: 11 },
    { id: 4, min: 12, max: 13 },
    { id: 5, min: 14, max: 15 },
    { id: 6, min: 16, max: 100 },
    { id: 7, min: 2, max: 5 },
  ];

  const category = CATEGORIES.find((c) => age >= c.min && age <= c.max);

  return { age, id_category: category ? category.id : null };
}
