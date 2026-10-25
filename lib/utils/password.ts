const PASSWORD_CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";

export const generatePassword = () =>
  Array.from(
    crypto.getRandomValues(new Uint32Array(12)),
    (n) => PASSWORD_CHARSET[n % PASSWORD_CHARSET.length],
  ).join("");
