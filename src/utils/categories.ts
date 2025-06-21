interface AgeCategoryReturn {
  age: number;
  category: string;
}

export function calculateAgeAndCategory(birthDate: string): AgeCategoryReturn {
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
  const CATEGORIES = [
    { min: 6, max: 7, name: "Pre Mini" },
    { min: 8, max: 9, name: "Mini" },
    { min: 10, max: 11, name: "Pre infantil" },
    { min: 12, max: 13, name: "Infantil" },
    { min: 14, max: 15, name: "Juvenil" },
    { min: 16, max: Infinity, name: "Mayores" },
  ];

  const { name } = CATEGORIES.find(
    (cat) => age >= cat.min && age <= cat.max
  ) || { name: "Sin categoría" };
  return { age, category: name };
}
