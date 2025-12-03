// Colores disponibles para productos con sus códigos hex
export interface Color {
  nombre: string;
  hex: string;
  id: number;
}

export const COLORES_DISPONIBLES: Color[] = [
  { id: 28, nombre: "Negro", hex: "#000000" },
  { id: 29, nombre: "Blanco", hex: "#FFFFFF" },
  { id: 30, nombre: "Azul", hex: "#0000FF" },
  { id: 31, nombre: "Verde", hex: "#008000" },
  { id: 32, nombre: "Plomo", hex: "#808080" },
  { id: 33, nombre: "Morado", hex: "#800080" },
  { id: 34, nombre: "Rosado", hex: "#FFC0CB" },
  { id: 35, nombre: "Rojo", hex: "#FF0000" },
  { id: 36, nombre: "Celeste", hex: "#87CEEB" },
  { id: 37, nombre: "Naranja", hex: "#FFA500" },
  { id: 38, nombre: "Amarillo", hex: "#FFFF00" },
  { id: 39, nombre: "Multicolor", hex: "#FFD700" }
];

// Función para obtener un color por nombre
export const obtenerColorPorNombre = (nombre: string): Color | undefined => {
  return COLORES_DISPONIBLES.find(color => color.nombre === nombre);
};

// Función para obtener un color por ID
export const obtenerColorPorId = (id: number): Color | undefined => {
  return COLORES_DISPONIBLES.find(color => color.id === id);
};

// Función para obtener todos los nombres de colores
export const obtenerNombresColores = (): string[] => {
  return COLORES_DISPONIBLES.map(color => color.nombre);
};
