import type { Product } from "../hooks/useProducts";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-[#413F39] rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col text-[#EBC431]">
      <img
        src={product.image}
        alt={product.title}
        className="h-40 object-contain mb-4 rounded-md bg-[#6B644C] p-2"
      />
      <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-[#EBC431]">
        {product.title}
      </h3>
      <p className="text-[#C0A648] mb-4">${product.price}</p>
      <button className="bg-[#EBC431] text-[#333027] rounded-lg py-2 font-semibold hover:bg-[#C0A648] transition">
        Añadir al carrito
      </button>
    </div>
  );
}
