interface ProductItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderSummaryProps {
  products: ProductItem[];
  subtotal: string;
  shipping: string;
  taxes: string;
  total: string;
}

export default function OrderSummary({
  products,
  subtotal,
  shipping,
  taxes,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-[#333027] border border-[#C0A648]/40 rounded-2xl p-6 shadow-lg w-full max-w-sm text-[#F5F5F5]">
      <h2 className="text-xl font-semibold mb-4 text-[#EBC431]">
        Tu pedido
      </h2>

      <div className="space-y-3 mb-6">
        {products.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm">
              {item.name} <span className="text-[#C0A648]/70">({item.quantity})</span>
            </span>
            <span className="font-medium">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#C0A648]/40 my-4"></div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{shipping}</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos</span>
          <span>{taxes}</span>
        </div>
      </div>

      <div className="border-t border-[#C0A648]/40 my-4"></div>

      <div className="flex justify-between text-lg font-bold text-[#EBC431]">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
}
