const PasswordHash = require('node-phpass').PasswordHash;

const hasher = new PasswordHash(8, true, 7);

export const generateHashedPassword = (password) => {
  return hasher.HashPassword(password);
};

export const verifyUserPassword = (password, hashedPassword) => {
  return hasher.CheckPassword(password, hashedPassword);
};
