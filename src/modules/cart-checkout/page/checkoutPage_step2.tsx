import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
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

  const apiUrl = `${import.meta.env.VITE_API_CART_CHECKOUT_URL}/api/envio`;
  const { user, createUser, idUsuario } = useShippingUser(apiUrl);

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
  const shippingCost =
    method === "express" ? 19.99 : method === "standard" ? 9.99 : 0;
  const total = subtotal + shippingCost;

  const handleContinue = async () => {
    const { nombreCompleto, email, telefono } = userInfo;

    if (!nombreCompleto.trim() || !email.trim() || !telefono.trim()) {
      setError(
        "Por favor, completa toda la información de contacto antes de continuar."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (!user && idUsuario) {
        await createUser({ idUsuario, ...userInfo });
      }
      navigate("/cart/checkout/step3", {
        state: { passedCart: cart, shippingMethod: method, userInfo: userInfo },
      });
    } catch (err) {
      console.error("Error al continuar:", err);
      setError(
        "Ocurrió un error al guardar la información. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete =
    userInfo.nombreCompleto.trim() !== "" &&
    userInfo.email.trim() !== "" &&
    userInfo.telefono.trim() !== "";

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <CheckoutSteps currentStep={2} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-[#665846] to-[#665846] p-8 rounded-3xl shadow-lg space-y-8 transition-transform hover:scale-[1.01]">
            <section className="space-y-4">
              <h1 className="text-3xl font-bold" style={{ color: "#EBC431" }}>
                Información de contacto
              </h1>
              <UserInfo values={userInfo} onChange={setUserInfo} />
              {error && <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>}
            </section>

            <div className="flex flex-col sm:flex-row justify-between gap-6 pt-6 border-t border-[#C0A648]/40">
              <button
                onClick={() =>
                  navigate("/cart/checkout/step1", { state: { cart } })
                }
                className="px-8 py-4 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium text-center"
              >
                ← Volver a método de entrega
              </button>

              <button
                onClick={handleContinue}
                disabled={!isFormComplete || isSubmitting}
                className={`px-8 py-4 rounded-lg border-2 border-[#C0A648] transition font-semibold text-center ${
                  !isFormComplete || isSubmitting
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-[#F5E27A] text-[#333027] hover:bg-[#EBC431] hover:scale-105 hover:shadow-md"
                }`}
              >
                {isSubmitting ? "Procesando..." : "Continuar →"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:sticky md:top-8 p-8 bg-[#2E2B24] rounded-2xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: "#EBC431" }}>
            Resumen del pedido
          </h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.idProducto}
                className="flex justify-between items-center p-4 rounded-xl"
                style={{ backgroundColor: "rgba(65,63,57,0.2)" }}
              >
                <div className="flex flex-col">
                  <span style={{ color: "#F5F5F5" }} className="font-medium">
                    {item.nombre || `Producto #${item.idProducto}`}
                  </span>
                  <span style={{ color: "rgba(245,245,245,0.7)", fontSize: "0.875rem" }}>
                    Cantidad: {item.cantidad} × ${item.precio.toFixed(2)}
                  </span>
                </div>
                <span style={{ color: "#EBC431" }} className="font-semibold">
                  ${(item.cantidad * item.precio).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#C0A648]/40 pt-4 space-y-2 text-lg bg-[#2E2B24] p-2 rounded">
            <div className="flex justify-between">
              <span style={{ color: "rgba(245,245,245,0.8)" }}>Subtotal</span>
              <span style={{ color: "#EBC431" }} className="font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "rgba(245,245,245,0.8)" }}>Envío</span>
              <span className="font-semibold">
                {shippingCost === 0 ? (
                  <span style={{ color: "green", fontWeight: 600 }}>GRATIS</span>
                ) : (
                  <span style={{ color: "#EBC431", fontWeight: 600 }}>${shippingCost.toFixed(2)}</span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2 p-2 rounded bg-[#2E2B24]">
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
