import jwt from 'jsonwebtoken';

export const generateToken = ({
  role,
  id,
}: {
  role: string;
  id: string;
}): string => {
  return jwt.sign(
    {
      role,
      sub: id,
    },
    'secret',
  );
};
