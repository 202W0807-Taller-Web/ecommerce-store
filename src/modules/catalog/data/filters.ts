// Estructura de datos para filtros basada en el JSON de la API
export interface AtributoValor {
  id: number;
  atributoId: number;
  valor: string;
}

export interface AtributoFiltro {
  id: number;
  nombre: string;
  atributoValores: AtributoValor[];
}

// Datos de filtros basados en el JSON proporcionado
export const ATRIBUTOS_FILTRO: AtributoFiltro[] = [
  {
    id: 1,
    nombre: "Categoría",
    atributoValores: [
      { id: 3, atributoId: 1, valor: "Accesorios" },
      { id: 1, atributoId: 1, valor: "Ropa" },
      { id: 2, atributoId: 1, valor: "Calzado" }
    ]
  },
  {
    id: 2,
    nombre: "Género",
    atributoValores: [
      { id: 6, atributoId: 2, valor: "Niños" },
      { id: 4, atributoId: 2, valor: "Hombre" },
      { id: 5, atributoId: 2, valor: "Mujer" }
    ]
  },
  {
    id: 3,
    nombre: "Deporte",
    atributoValores: [
      { id: 12, atributoId: 3, valor: "Básquet" },
      { id: 13, atributoId: 3, valor: "Voleibol" },
      { id: 14, atributoId: 3, valor: "Deportes acuáticos" },
      { id: 7, atributoId: 3, valor: "Urbano" },
      { id: 8, atributoId: 3, valor: "Futbol" },
      { id: 9, atributoId: 3, valor: "Correr" },
      { id: 10, atributoId: 3, valor: "Entrenar" },
      { id: 11, atributoId: 3, valor: "Tenis" }
    ]
  },
  {
    id: 4,
    nombre: "Tipo",
    atributoValores: [
      { id: 26, atributoId: 4, valor: "Guantes" },
      { id: 15, atributoId: 4, valor: "Zapatilla" },
      { id: 16, atributoId: 4, valor: "Chimpunes" },
      { id: 17, atributoId: 4, valor: "Sandalias" },
      { id: 18, atributoId: 4, valor: "Polos" },
      { id: 19, atributoId: 4, valor: "Shorts" },
      { id: 20, atributoId: 4, valor: "Pantalones" },
      { id: 21, atributoId: 4, valor: "Casacas" },
      { id: 22, atributoId: 4, valor: "Ropa de baño" },
      { id: 23, atributoId: 4, valor: "Bolsas y mochilas" },
      { id: 24, atributoId: 4, valor: "Gorras" },
      { id: 25, atributoId: 4, valor: "Medias" }
    ]
  },
  {
    id: 5,
    nombre: "Colección",
    atributoValores: [
      { id: 27, atributoId: 5, valor: "Colección 2025" }
    ]
  },
  {
    id: 6,
    nombre: "Talla",
    atributoValores: [
      { id: 40, atributoId: 6, valor: "XS" },
      { id: 41, atributoId: 6, valor: "S" },
      { id: 42, atributoId: 6, valor: "M" },
      { id: 43, atributoId: 6, valor: "L" },
      { id: 44, atributoId: 6, valor: "XL" },
      { id: 45, atributoId: 6, valor: "XXL" },
      { id: 46, atributoId: 6, valor: "XXXL" }
    ]
  },
  {
    id: 11,
    nombre: "Color",
    atributoValores: [
      { id: 30, atributoId: 11, valor: "Azul" },
      { id: 31, atributoId: 11, valor: "Verde" },
      { id: 32, atributoId: 11, valor: "Plomo" },
      { id: 33, atributoId: 11, valor: "Morado" },
      { id: 34, atributoId: 11, valor: "Rosado" },
      { id: 35, atributoId: 11, valor: "Rojo" },
      { id: 36, atributoId: 11, valor: "Celeste" },
      { id: 37, atributoId: 11, valor: "Naranja" },
      { id: 38, atributoId: 11, valor: "Amarillo" },
      { id: 39, atributoId: 11, valor: "Multicolor" },
      { id: 29, atributoId: 11, valor: "Blanco" },
      { id: 28, atributoId: 11, valor: "Negro" }
    ]
  }
];

// Función para obtener atributos de filtro por nombre
export const obtenerAtributoPorNombre = (nombre: string): AtributoFiltro | undefined => {
  return ATRIBUTOS_FILTRO.find(atributo => atributo.nombre === nombre);
};

// Función para obtener todos los atributos de filtro
export const obtenerTodosLosAtributos = (): AtributoFiltro[] => {
  return ATRIBUTOS_FILTRO;
};
