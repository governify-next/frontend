export const toggleItem = <T>(list: T[], item: T) =>
  list.includes(item)
    ? list.filter((current) => current !== item)
    : [...list, item];

export const sameItems = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((item) => b.includes(item));
