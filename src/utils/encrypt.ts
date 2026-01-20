import bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

// export const comparePassword = async (
//   plainPassword: string, // mot de passe en clair d'abord
//   hashedPassword: string, // hash de la base de données ensuite
// ): Promise<boolean> => {
//   return await bcrypt.compare(plainPassword, hashedPassword);
// };

// utils/index.ts

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    if (!plainPassword || !hashedPassword) {
      console.error('Missing password for comparison');
      return false;
    }

    // bcrypt.compare attend : plainText, hash
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};
