const now = new Date();
export const tomorrowNoon = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() + 1, // tomorrow
  12,
  0,
  0,
  0, // 12:00:00.000
);
