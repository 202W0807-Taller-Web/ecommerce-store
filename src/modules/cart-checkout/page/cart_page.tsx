import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/orderSummary"; // 👈 importa tu componente

export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.reduce((acc, it) => acc + it.cantidad, 0);
  const subtotal = cart.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  if (loading) return <p className="text-center text-gray-300 mt-10">Cargando carrito...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">Error: {error}</p>;

  // 🧾 Transformamos el carrito al formato que OrderSummary necesita
  const products = cart.map((item) => ({
    name: item.nombre || "Producto sin nombre",
    quantity: item.cantidad,
    price: `$${item.precio.toFixed(2)}`,
  }));

  return (
    <div className="max-w-6xl mx-auto p-8 text-[#EBC431]">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
        TU CARRITO ({itemCount} producto{itemCount !== 1 ? "s" : ""})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* 🛒 Lista de productos */}
        <div className="md:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <p className="text-center text-[#F5F5F5]/70">Tu carrito está vacío.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.idProducto}
                className="flex items-center justify-between bg-[#333027] border border-[#C0A648]/40 rounded-2xl p-5 hover:bg-[#413F39] transition-all duration-200 shadow-md"
              >
                {/* 🖼️ Imagen + info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.imagenUrl || "/placeholder.png"}
                    alt={item.nombre || "Producto"}
                    className="h-16 w-16 object-contain rounded-md bg-[#6B644C]/30"
                  />
                  <div>
                    <p className="font-semibold text-[#EBC431] text-lg">
                      {item.nombre ?? "Producto sin nombre"}
                    </p>
                    <p className="text-sm text-[#F5F5F5]/80">${item.precio.toFixed(2)}</p>
                  </div>
                </div>

                {/* 🔢 Controles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.idProducto, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                    className="px-3 py-1 bg-[#6B644C] rounded text-white hover:bg-[#7E775B] transition disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-[#F5F5F5] font-medium text-lg">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.idProducto, item.cantidad + 1)}
                    className="px-3 py-1 bg-[#6B644C] rounded text-white hover:bg-[#7E775B] transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.idProducto)}
                    className="ml-3 text-red-400 hover:text-red-300 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 💰 Resumen de pedido */}
        <div className="md:sticky md:top-8 flex flex-col items-center">
          <OrderSummary
            products={products}
            subtotal={`$${subtotal.toFixed(2)}`}
            shipping="$0.00"
            taxes={`$${iva.toFixed(2)}`}
            total={`$${total.toFixed(2)}`}
          />

          <button
            onClick={() => navigate("/checkout/step1" , { state: {cart}})}
            className="mt-6 w-60 bg-[#EBC431] text-[#333027] rounded-lg py-2 font-semibold text-lg hover:bg-[#F5E27A] transition-all duration-200 shadow-md"
          >
            Continuar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
