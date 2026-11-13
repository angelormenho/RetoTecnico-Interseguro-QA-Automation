/**
 * Extrae el valor numérico de un texto con precio, p. ej. "$29.99" o
 * "Item total: $39.98".
 */
export function parsePrice(text: string): number {
  const match = text.match(/\$\s*(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No se encontró un precio en el texto: "${text}"`);
  }
  return Number(match[1]);
}

/**
 * Suma precios trabajando en centavos para evitar errores de coma flotante
 * (0.1 + 0.2 !== 0.3).
 */
export function sumPrices(prices: number[]): number {
  const cents = prices.reduce((acc, price) => acc + Math.round(price * 100), 0);
  return cents / 100;
}