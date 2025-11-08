/**
 * Mapeo de nombres de colores a códigos hexadecimales
 */
const COLOR_MAP: Record<string, string> = {
  "Negro": "#000000",
  "Blanco": "#FFFFFF",
  "Azul": "#0000FF",
  "Verde": "#008000",
  "Plomo": "#808080",
  "Morado": "#800080",
  "Rosado": "#FFC0CB",
  "Rojo": "#FF0000",
  "Celeste": "#87CEEB",
  "Naranja": "#FFA500",
  "Amarillo": "#FFFF00",
  "Multicolor": "#FFD700"
};

/**
 * Obtiene el código hexadecimal de un color por su nombre
 */
export const getColorHex = (colorName: string): string => {
  return COLOR_MAP[colorName] || "#808080"; // Default to gray if not found
};
