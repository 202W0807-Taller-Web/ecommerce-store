import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
import OrderSummary from "../components/orderSummary";
import UserInfo from "../components/infoUserForm";
import { useShippingUser } from "../hooks/useShippingUser";
import { useEffect, useState } from "react";

interface CartItem {
  idProducto: number;
  nombre: string | null;
  precio: number;
  cantidad: number;
}

export default function Checkout_Step2() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.passedCart as CartItem[] | undefined;
  const method = location.state?.method as string | undefined;
  console.log(method);
  const idUsuario = 20; // valor hardcodeado

  const apiUrl = `${import.meta.env.VITE_API_CART_CHECKOUT_URL}api/envio`;
  const { user, createUser } = useShippingUser(apiUrl, idUsuario);

  const [userInfo, setUserInfo] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setUserInfo({
        nombreCompleto: user.nombreCompleto || "",
        email: user.email || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  if (!cart) {
    return (
      <div className="text-center text-gray-300 mt-10">
        No hay carrito disponible.{" "}
        <Link to="/cart" className="text-[#EBC431] underline">
          Volver
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  const shippingCost = method === "express" ? 19.99 : method === "standard" ? 9.99 : 0;
  const taxes = subtotal * 0.18;
  const total = subtotal + shippingCost + taxes;

  const handleContinue = async () => {
    const { nombreCompleto, email, telefono } = userInfo;

    // Validación simple
    if (!nombreCompleto.trim() || !email.trim() || !telefono.trim()) {
      setError("Por favor, completa toda la información de contacto antes de continuar.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        await createUser({
          idUsuario,
          ...userInfo,
        });
      }

      navigate("/checkout/step3", { state: { passedCart: cart, shippingMethod: method, userInfo: userInfo } });

    } catch (err) {
      console.error("Error al continuar:", err);
      setError("Ocurrió un error al guardar la información. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete =
    userInfo.nombreCompleto.trim() !== "" &&
    userInfo.email.trim() !== "" &&
    userInfo.telefono.trim() !== "";

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CheckoutSteps currentStep={2} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-10">
          {/* Información de contacto */}
          <section>
            <h1 className="text-3xl font-bold mb-6 text-[#EBC431]">
              Información de contacto
            </h1>
            <UserInfo values={userInfo} onChange={setUserInfo} />
            {error && (
              <p className="text-red-400 text-sm mt-4">
                ⚠️ {error}
              </p>
            )}
          </section>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-[#C0A648]/40">
            <button
              onClick={() => navigate("/checkout/step1", { state: { cart } })}
              className="px-6 py-3 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium"
            >
              ← Volver a método de entrega
            </button>

            <button
              onClick={handleContinue}
              disabled={!isFormComplete || isSubmitting}
              className={`px-6 py-3 rounded-lg border-2 border-[#C0A648] transition font-semibold ${!isFormComplete || isSubmitting
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-[#F5E27A] text-[#333027] hover:bg-[#EBC431] hover:scale-105 hover:shadow-md"
                }`}
            >
              {isSubmitting ? "Procesando..." : "Continuar →"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:sticky md:top-8">
          {cart ? (
            <OrderSummary
              products={cart.map((item) => ({
                name: item.nombre || `Producto #${item.idProducto}`,
                quantity: item.cantidad,
                price: `$${item.precio.toFixed(2)}`,
              }))}
              subtotal={`$${subtotal.toFixed(2)}`}
              shipping={shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`}
              taxes={`$${taxes.toFixed(2)}`}
              total={`$${total.toFixed(2)}`}
            />
          ) : (
            <p className="text-gray-400">Tu carrito está vacío.</p>
          )}
        </div>
      </div>
    </div>
  );
}
