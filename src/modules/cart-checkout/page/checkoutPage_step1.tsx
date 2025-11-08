import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
import OrderSummary from "../components/orderSummary";

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
    { id: "standard", name: "Envío Estándar (3–5 días)", price: 9.99, description: "Entrega en 3 a 5 días hábiles" },
    // { id: "express", name: "Envío Express (1–2 días)", price: 19.99, description: "Entrega rápida en 1 o 2 días hábiles" },
    { id: "pickup", name: "Recojo en tienda", price: 0, description: "Disponible para recojo en 2 días" },
  ];

  const shipping = selected ? shippingOptions.find(o => o.id === selected)?.price || 0 : 0;
  const taxes = subtotal * 0.18;
  const total = subtotal + shipping + taxes;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CheckoutSteps currentStep={1} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {/* Columna izquierda: opciones de envío */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-8 text-[#EBC431]">Selecciona tu método de envío</h1>

          <div className="space-y-6">
            {shippingOptions.map((option) => {
              const isSelected = selected === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                  className={`w-full p-6 text-left border rounded-2xl shadow-md transition-all duration-200
                    ${isSelected
                      ? "border-[#EBC431] bg-[#413F39]/70 shadow-lg"
                      : "border-[#C0A648]/40 bg-[#333027] hover:border-[#EBC431]/80 hover:bg-[#413F39]/50"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className={`text-xl font-semibold ${isSelected ? "text-[#EBC431]" : "text-[#F5F5F5]"}`}>
                      {option.name}
                    </h2>
                    {isSelected && (
                      <span className="text-[#333027] font-semibold text-sm bg-[#EBC431] px-3 py-1 rounded-full">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <p className="text-[#F5F5F5]/80">{option.description}</p>
                  <p className={`mt-2 font-semibold ${isSelected ? "text-[#EBC431]" : "text-[#C0A648]"}`}>
                    {option.price === 0 ? "GRATIS" : `$${option.price.toFixed(2)}`}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between mt-12">
            <Link
              to="/cart"
              className="px-6 py-3 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium"
            >
              ← Volver al carrito
            </Link>

            <button
              disabled={!selected}
              onClick={() => selected && navigate("/checkout/step2", { state: { method: selected , passedCart} })}
              className={`px-6 py-3 rounded-lg font-semibold shadow-sm transition-all transform
                ${selected
                  ? "bg-[#F5E27A] text-[#333027] hover:bg-[#EBC431] hover:scale-105 hover:shadow-md border-2 border-[#C0A648]"
                  : "bg-[#EBC431] text-[#968751] cursor-not-allowed opacity-70 border-2 border-[#413F39]"
                }`}
            >
              Siguiente paso →
            </button>
          </div>
        </div>

        {/* Columna derecha — resumen del pedido */}
        <div className="md:sticky md:top-8">
          <OrderSummary
            products={passedCart.map((item: CartItem) => ({
              name: item.nombre || `Producto #${item.idProducto}`,
              quantity: item.cantidad,
              price: `$${item.precio.toFixed(2)}`,
            }))}
            subtotal={`$${subtotal.toFixed(2)}`}
            shipping={shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}
            taxes={`$${taxes.toFixed(2)}`}
            total={`$${total.toFixed(2)}`}
          />
        </div>
      </div>
    </div>
  );
}
