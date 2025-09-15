import { useEffect, useState } from "react";

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Usamos variable de entorno para endpoint
        const apiUrl = import.meta.env.VITE_API_URL || "https://fakestoreapi.com";
        const res = await fetch(`${apiUrl}/products?limit=4`);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
