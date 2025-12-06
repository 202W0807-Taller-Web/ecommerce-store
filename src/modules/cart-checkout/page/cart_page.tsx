import { useState, useMemo, useContext } from "react";
import { useCart } from "../hooks/useCart";
import { useStockValidation } from "../hooks/useStockValidation";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../client-auth/context/AuthContext";
import OrderSummary from "../components/orderSummary";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);

  const items = cart?.items || [];

  const productIds = useMemo(() => {
    return items.map((item) => item.idProducto);
  }, [JSON.stringify(items.map((i) => i.idProducto))]);
  const {
    getProductStockStatus,
    loading: stockLoading,
    validateCart,
  } = useStockValidation(productIds);

  const itemCount = items.reduce((acc, it) => acc + it.cantidad, 0);
  const subtotal = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  const total = subtotal;

  // Validar si se puede proceder al checkout
  const cartValidation = useMemo(() => {
    if (loading || stockLoading || items.length === 0) return null;
    return validateCart(
      items.map((item) => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
      })),
    );
  }, [items, loading, stockLoading, validateCart]);

  const showToast = (
    message: string,
    type: "error" | "success" | "warning" = "error",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateQuantity = async (
    idProducto: number,
    nuevaCantidad: number,
    idVariante?: number | null,
  ) => {
    const stockStatus = getProductStockStatus(idProducto, nuevaCantidad);

    if (nuevaCantidad > stockStatus.cantidadMaxima) {
      showToast(
        `Solo hay ${stockStatus.cantidadMaxima} unidades disponibles`,
        "warning",
      );
      return;
    }

    try {
      await updateQuantity(idProducto, nuevaCantidad, idVariante);
    } catch (err) {
      showToast("Error al actualizar cantidad. Intenta de nuevo.");
    }
  };

  const handleRemove = async (
    idProducto: number,
    idVariante?: number | null,
  ) => {
    try {
      await removeFromCart(idProducto, idVariante);
      showToast("Producto eliminado", "success");
    } catch (err) {
      showToast("Error al eliminar producto. Intenta de nuevo.");
    }
  };

  const handleContinue = () => {
    // Validar autenticación primero
    if (!auth?.isAuth) {
      navigate("/login", {
        state: {
          from: "/cart",
          returnTo: "/checkout/step1",
          message: "Inicia sesión para continuar con tu compra",
        },
      });
      return;
    }

    // Validar stock
    if (!cartValidation?.isValid) {
      if (cartValidation?.hasOutOfStock) {
        showToast(
          "Hay productos sin stock. Por favor, elimínalos del carrito.",
          "error",
        );
      } else if (cartValidation?.hasExceeded) {
        showToast(
          "La cantidad de algunos productos excede el stock disponible.",
          "error",
        );
      }
      return;
    }

    navigate("/checkout/step1", {
      state: { cart: items, cartId: cart?.id },
    });
  };

  if (loading && !cart) {
    return (
      <p className="text-center text-gray-300 mt-10">Cargando carrito...</p>
    );
  }

  const products = items.map((item) => ({
    name: item.nombre || "Producto sin nombre",
    quantity: item.cantidad,
    price: `$${item.precio.toFixed(2)}`,
  }));

  return (
    <div className="max-w-6xl mx-auto p-8 text-[#EBC431]">
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : toast.type === "warning"
                ? "bg-yellow-500 text-black"
                : "bg-green-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
        TU CARRITO ({itemCount} producto{itemCount !== 1 ? "s" : ""})
      </h2>

      {/* Alerta de problemas de stock */}
      {!loading &&
        !stockLoading &&
        cartValidation &&
        !cartValidation.isValid && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 font-semibold">
              ⚠️ Problemas con el stock:
            </p>
            <ul className="mt-2 text-sm text-red-300 list-disc list-inside">
              {cartValidation.hasOutOfStock && (
                <li>Algunos productos ya no tienen stock disponible</li>
              )}
              {cartValidation.hasExceeded && (
                <li>La cantidad solicitada excede el stock disponible</li>
              )}
            </ul>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#F5F5F5]/70 text-xl mb-4">
                Tu carrito está vacío.
              </p>
              <button
                onClick={() => navigate("/catalog")}
                className="px-6 py-3 bg-[#EBC431] text-[#333027] rounded-lg hover:bg-[#F5E27A] transition font-semibold"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            items.map((item) => {
              const stockStatus = getProductStockStatus(
                item.idProducto,
                item.cantidad,
              );
              const hasStockIssue =
                !stockStatus.tieneStock || stockStatus.excedeCantidad;

              return (
                <div
                  key={`${item.idProducto}-${item.idVariante || 0}`}
                  className={`flex items-center justify-between rounded-2xl p-5 transition-all duration-200 shadow-md
                    ${
                      hasStockIssue
                        ? "bg-red-900/20 border-2 border-red-500/50"
                        : "bg-[#333027] border border-[#C0A648]/40 hover:bg-[#413F39]"
                    }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.imagenUrl || "/placeholder.png"}
                      alt={item.nombre || "Producto"}
                      className={`h-16 w-16 object-contain rounded-md ${
                        hasStockIssue
                          ? "opacity-50 grayscale"
                          : "bg-[#6B644C]/30"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-lg ${
                          hasStockIssue ? "text-red-400" : "text-[#EBC431]"
                        }`}
                      >
                        {item.nombre ?? "Producto sin nombre"}
                      </p>
                      <p className="text-sm text-[#F5F5F5]/80">
                        ${item.precio.toFixed(2)}
                      </p>

                      {stockLoading ? (
                        <p className="text-xs text-gray-400 mt-1">
                          Verificando stock...
                        </p>
                      ) : !stockStatus.tieneStock ? (
                        <p className="text-xs text-red-400 font-semibold mt-1">
                          ❌ Sin stock disponible
                        </p>
                      ) : stockStatus.excedeCantidad ? (
                        <p className="text-xs text-yellow-400 font-semibold mt-1">
                          ⚠️ Solo quedan {stockStatus.cantidadMaxima} unidades
                        </p>
                      ) : stockStatus.stockDisponible <= 5 ? (
                        <p className="text-xs text-yellow-300 mt-1">
                          ⚡ Últimas unidades disponibles
                        </p>
                      ) : (
                        <p className="text-xs text-green-400 mt-1">
                          ✓ Stock disponible
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.idProducto,
                          item.cantidad - 1,
                          item.idVariante,
                        )
                      }
                      disabled={item.cantidad <= 1 || !stockStatus.tieneStock}
                      className="px-3 py-1 bg-[#6B644C] rounded text-white hover:bg-[#7E775B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-[#F5F5F5] font-medium text-lg min-w-[2rem] text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.idProducto,
                          item.cantidad + 1,
                          item.idVariante,
                        )
                      }
                      disabled={
                        !stockStatus.tieneStock ||
                        item.cantidad >= stockStatus.cantidadMaxima
                      }
                      className="px-3 py-1 bg-[#6B644C] rounded text-white hover:bg-[#7E775B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        handleRemove(item.idProducto, item.idVariante)
                      }
                      className="ml-3 text-red-400 hover:text-red-300 transition"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="md:sticky md:top-8 flex flex-col items-center">
          <OrderSummary
            products={products}
            subtotal={`$${subtotal.toFixed(2)}`}
            shipping="$0.00"
            total={`$${total.toFixed(2)}`}
          />

          <button
            onClick={handleContinue}
            disabled={
              items.length === 0 || !cartValidation?.isValid || stockLoading
            }
            className={`mt-6 w-60 rounded-lg py-2 font-semibold text-lg transition-all duration-200 shadow-md
              ${
                items.length === 0 || !cartValidation?.isValid || stockLoading
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                  : "bg-[#EBC431] text-[#333027] hover:bg-[#F5E27A] hover:scale-105"
              }`}
          >
            {stockLoading
              ? "Verificando stock..."
              : !auth?.isAuth
                ? "Iniciar sesión para continuar"
                : "Continuar Compra"}
          </button>

          {!auth?.isAuth && items.length > 0 && (
            <p className="text-xs text-blue-300 text-center mt-2">
              Tus productos se guardarán al iniciar sesión
            </p>
          )}

          {auth?.isAuth && cartValidation && !cartValidation.isValid && (
            <p className="text-xs text-red-400 text-center mt-2">
              Corrige los problemas de stock para continuar
            </p>
          )}
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
