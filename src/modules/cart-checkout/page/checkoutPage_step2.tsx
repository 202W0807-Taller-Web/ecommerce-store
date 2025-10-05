import { Link, useLocation } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
import PickupSelection from "../components/pickupSelection";
import ShippingForm from "../components/shippingForm";
import OrderSummary from "../components/orderSummary";
import UserInfo from "../components/infoUserForm";

export default function Checkout_Step2() {
  const location = useLocation();
  const method = location.state?.method || "standard";

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CheckoutSteps currentStep={2} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-10">
          {method !== "pickup" ? (
            <>
              {/* Información de contacto */}
              <section>
                <h1 className="text-3xl font-bold mb-6 text-[#EBC431]">
                  Información de contacto
                </h1>
                <UserInfo />
              </section>

              {/* Dirección de envío */}
              <section>
                <h1 className="text-3xl font-bold mb-6 text-[#EBC431]">
                  Dirección de envío
                </h1>
                <ShippingForm />
              </section>
            </>
          ) : (
            <section>
              <h1 className="text-3xl font-bold mb-6 text-[#EBC431]">
                Selecciona tu tienda de recojo
              </h1>
              <PickupSelection />
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-[#C0A648]/40">
            <Link
              to="/checkout/step1"
              className="px-6 py-3 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium"
            >
              ← Volver a método de entrega
            </Link>
            <Link
              to="/checkout/step3"
              className="px-6 py-3 rounded-lg bg-[#F5E27A] text-[#333027] hover:bg-[#EBC431] hover:scale-105 hover:shadow-md border-2 border-[#C0A648]"
            >
              Continuar al pago →
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:sticky md:top-8">
          <OrderSummary
            products={[
              { name: "Producto A", quantity: 1, price: "$24.99" },
              { name: "Producto B", quantity: 2, price: "$39.98" },
            ]}
            subtotal="$64.97"
            shipping="$9.99"
            taxes="$3.50"
            total="$78.46"
          />
        </div>
      </div>
    </div>
  );
}
