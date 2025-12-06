import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";

interface CartItem {
  idProducto: number;
  nombre: string | null;
  precio: number;
  cantidad: number;
}

export default function Checkout_Step1() {
  const [selected, setSelected] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const passedCart = location.state?.cart as CartItem[] | null;

  if (!passedCart) {
    navigate("/cart");
    return null;
  }

  const subtotal = passedCart.reduce((acc, it) => acc + it.precio * it.cantidad, 0);

  const shippingOptions = [
    { id: "standard", name: "Envío Estándar", price: 9.99, description: "Entrega en 3 a 5 días hábiles", icon: "🚚" },
    { id: "pickup", name: "Recojo en tienda", price: 0, description: "Disponible para recojo en 2 días", icon: "🏬" },
  ];

  const shipping = selected ? shippingOptions.find((o) => o.id === selected)?.price || 0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <CheckoutSteps currentStep={1} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Contenedor del paso de envío */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-[#665846] to-[#665846] p-8 rounded-3xl shadow-lg space-y-8 transition-transform hover:scale-[1.01]">
            <h1 className="text-3xl font-bold" style={{ color: "#EBC431" }}>
              Selecciona tu método de envío
            </h1>

            {shippingOptions.map((option) => {
              const isSelected = selected === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                  className={`w-full p-6 border rounded-2xl shadow-md flex flex-col gap-3 transition-all duration-300
                    ${isSelected
                      ? "border-[#EBC431] bg-[#413F39]/80 shadow-2xl"
                      : "border-[#C0A648]/30 bg-[#2E2B24] hover:border-[#EBC431]/80 hover:bg-[#413F39]/50"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <h2 className={`text-2xl font-semibold ${isSelected ? "" : "text-[#F5F5F5]"}`} style={isSelected ? { color: "#EBC431" } : {}}>
                        {option.name}
                      </h2>
                    </div>
                    {isSelected && (
                      <span className="text-[#333027] font-semibold text-sm bg-[#EBC431] px-3 py-1 rounded-full">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <p className="text-[#F5F5F5]/80 text-lg">{option.description}</p>
                  <p className={`mt-2 text-xl font-semibold`} style={isSelected ? { color: "#EBC431" } : { color: "#C0A648" }}>
                    {option.price === 0 ? <span style={{ color: "green" }}>GRATIS</span> : `$${option.price.toFixed(2)}`}
                  </p>
                </button>
              );
            })}

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-between mt-12 gap-6">
              <Link
                to="/cart"
                className="px-8 py-4 rounded-lg border-2 text-center font-medium"
                style={{ color: "#EBC431", borderColor: "#C0A648", backgroundColor: "#333027" }}
              >
                ← Volver al carrito
              </Link>

              <button
                disabled={!selected}
                onClick={() =>
                  selected &&
                  navigate("/cart/checkout/step2", {
                    state: { method: selected, passedCart },
                  })
                }
                className={`px-8 py-4 rounded-lg font-semibold shadow-md transition-all transform text-center`}
                style={
                  selected
                    ? { backgroundColor: "#F5E27A", color: "#333027", border: "2px solid #C0A648" }
                    : { backgroundColor: "#EBC431", color: "#968751", border: "2px solid #413F39", cursor: "not-allowed", opacity: 0.7 }
                }
              >
                Siguiente paso →
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha — resumen del pedido */}
        <div className="md:sticky md:top-8 p-8 bg-[#2E2B24] rounded-2xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#EBC431" }}>Resumen del pedido</h2>
          <div className="space-y-4">
            {passedCart.map((item) => (
              <div
                key={item.idProducto}
                className="flex justify-between items-center p-4 rounded-xl"
                style={{ backgroundColor: "rgba(65, 63, 57, 0.2)" }}
              >
                <div className="flex flex-col">
                  <span className="font-medium" style={{ color: "#F5F5F5" }}>{item.nombre || `Producto #${item.idProducto}`}</span>
                  <span style={{ color: "rgba(245,245,245,0.7)", fontSize: "0.875rem" }}>
                    Cantidad: {item.cantidad} × ${item.precio.toFixed(2)}
                  </span>
                </div>
                <span className="font-semibold" style={{ color: "#EBC431" }}>
                  ${(item.cantidad * item.precio).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#C0A648]/40 pt-4 space-y-2 text-lg">
            <div className="flex justify-between">
              <span style={{ color: "rgba(245,245,245,0.8)" }}>Subtotal</span>
              <span className="font-semibold" style={{ color: "#EBC431" }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "rgba(245,245,245,0.8)" }}>Envío</span>
              <span className="font-semibold">
                {shipping === 0
                  ? <span style={{ color: "green", fontWeight: 600 }}>GRATIS</span>
                  : <span style={{ color: "#EBC431", fontWeight: 600 }}>${shipping.toFixed(2)}</span>
                }
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2">
              <span style={{ color: "#F5F5F5" }}>Total</span>
              <span style={{ color: "#EBC431", fontWeight: 800, fontSize: "1.25rem" }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
