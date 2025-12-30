export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
