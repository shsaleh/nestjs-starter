export function getRandomInt(length: number) {
  const min = Math.pow(10, length - 1); // Minimum value for the desired length
  const max = Math.pow(10, length) - 1; // Maximum value for the desired length
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
