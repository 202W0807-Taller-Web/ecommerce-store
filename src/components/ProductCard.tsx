import type { Product } from "../hooks/useProducts";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.title}
        className="h-40 object-contain mb-4"
      />
      <h3 className="text-lg font-semibold mb-2 line-clamp-1">
        {product.title}
      </h3>
      <p className="text-gray-600 mb-4">${product.price}</p>
      <button className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
        Añadir al carrito
      </button>
    </div>
  );
}
