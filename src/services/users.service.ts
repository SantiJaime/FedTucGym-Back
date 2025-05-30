export default class UserService {
  private users: User[] = [
    {
      id: 1,
      fullname: "Santi Jaime",
      email: "5o2WZ@example.com",
      password: "password123",
    },
  ];

  public async getUsers(): Promise<User[]> {
    return this.users;
  }

  public async getUserById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  public async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  public async updateUser(user: User): Promise<User | undefined> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return user;
    }
    return undefined;
  }

  public async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length !== initialLength;
  }
}
