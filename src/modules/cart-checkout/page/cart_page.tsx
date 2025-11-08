// CartPage.tsx
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/orderSummary";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const items = cart?.items || [];

  const itemCount = items.reduce((acc, it) => acc + it.cantidad, 0);
  const subtotal = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  // Mostrar toast temporal
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Manejar actualización de cantidad con error handling
  const handleUpdateQuantity = async (
    idProducto: number,
    nuevaCantidad: number,
    idVariante?: number | null
  ) => {
    try {
      await updateQuantity(idProducto, nuevaCantidad, idVariante);
    } catch (err) {
      showToast("Error al actualizar cantidad. Intenta de nuevo.");
    }
  };

  // Manejar eliminación con error handling
  const handleRemove = async (idProducto: number, idVariante?: number | null) => {
    try {
      await removeFromCart(idProducto, idVariante);
      showToast("Producto eliminado", "success");
    } catch (err) {
      showToast("Error al eliminar producto. Intenta de nuevo.");
    }
  };

  if (loading && !cart) {
    return <p className="text-center text-gray-300 mt-10">Cargando carrito...</p>;
  }

  const products = items.map((item) => ({
    name: item.nombre || "Producto sin nombre",
    quantity: item.cantidad,
    price: `$${item.precio.toFixed(2)}`
  }));

  return (
    <div className="max-w-6xl mx-auto p-8 text-[#EBC431]">
      {/* Toast de notificaciones */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
            toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
        TU CARRITO ({itemCount} producto{itemCount !== 1 ? "s" : ""})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* 🛒 Lista de productos */}
        <div className="md:col-span-2 space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-[#F5F5F5]/70">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.idProducto}-${item.idVariante || 0}`}
                className="flex items-center justify-between bg-[#333027] border border-[#C0A648]/40 rounded-2xl p-5 hover:bg-[#413F39] transition-all duration-200 shadow-md"
              >
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

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.idProducto, item.cantidad - 1, item.idVariante)}
                    disabled={item.cantidad <= 1}
                    className="px-3 py-1 bg-[#6B644C] rounded text-white hover:bg-[#7E775B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-[#F5F5F5] font-medium text-lg">{item.cantidad}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.idProducto, item.cantidad + 1, item.idVariante)}
                    className="px-3 py-1 bg-[#6B644C] rounded text-white hover:bg-[#7E775B] transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.idProducto, item.idVariante)}
                    className="ml-3 text-red-400 hover:text-red-300 transition"
                    title="Eliminar producto"
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
            onClick={() =>
              navigate("/checkout/step1", {
                state: { cart: items, cartId: cart?.id || 7 }
              })
            }
            disabled={items.length === 0}
            className="mt-6 w-60 bg-[#EBC431] text-[#333027] rounded-lg py-2 font-semibold text-lg hover:bg-[#F5E27A] transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar Compra
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}