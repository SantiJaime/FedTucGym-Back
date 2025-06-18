interface UserResponse {
  id: number;
  full_name: string;
  role: string;
  password?: string;
}

type CreateMember = Omit<Member, "id"> & { age: number; category: string };

interface UpdateTokenParams {
  id: number;
  oldToken: string;
  newToken: string;
}
