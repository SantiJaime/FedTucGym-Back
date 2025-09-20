interface UserResponse {
  id: number;
  full_name: string;
  role: string;
  category: string;
  id_category: 1 | 2 | 3;
}

type CreateMember = Omit<Member, "id"> & {
  age: number;
  id_category: CategoryID;
};

interface UpdateTokenParams {
  id: number;
  oldToken: string;
  newToken: string;
}
type CategoryID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;

interface FullMemberInfo {
  id: number;
  full_name: string;
  birth_date: string;
  age: number;
  category: string;
  gym: string;
  dni: number;
  level: string;
  total_count: number;
}
