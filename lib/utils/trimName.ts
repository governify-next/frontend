export const avatarFallback = (text: string) => {
  return text.trim().charAt(0).toUpperCase() || "U";
};
