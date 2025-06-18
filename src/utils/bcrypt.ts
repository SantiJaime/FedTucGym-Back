import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const compare = await bcrypt.compare(password, hash);
    return compare;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error desconocido de Bcrypt");
  }
};