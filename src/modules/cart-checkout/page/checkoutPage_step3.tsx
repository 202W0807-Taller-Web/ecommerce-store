import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
import OrderSummary from "../components/orderSummary";
import ShippingForm from "../components/shippingForm";
import PickupSelection from "../components/pickupSelection";
import CarrierSelection from "../components/carrierSelection";
import { useState } from "react";

interface CartItem {
  idProducto: number;
  nombre: string | null;
  precio: number;
  cantidad: number;
}

export default function Checkout_Step3() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.passedCart as CartItem[] | undefined;
  const method = location.state?.shippingMethod as string | undefined;
  const userInfo = location.state?.userInfo;

  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Para RECOJO EN TIENDA - guardamos toda la info necesaria
  const [pickupInfo, setPickupInfo] = useState<{
    tienda: any;
    almacenOrigen: any;
    recojoInfo: any;
  } | null>(null);

  // Para ENVÍO A DOMICILIO - guardamos toda la info necesaria
  const [carrierInfo, setCarrierInfo] = useState<{
    carrier: any;
    almacenOrigen: any;
    distanciaKm: number;
  } | null>(null);

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

  // Calcular costo de envío según el método y selección
  let shippingCost = 0;
  if (method === "pickup") {
    shippingCost = 0; // Recojo en tienda siempre es gratis
  } else if (carrierInfo) {
    shippingCost = carrierInfo.carrier.costo_envio;
  }

  const taxes = subtotal * 0.18;
  const total = subtotal + shippingCost + taxes;

  // Determinar si se puede continuar
  const canContinue = method === "pickup" 
    ? pickupInfo !== null 
    : (selectedAddress !== null && carrierInfo !== null);

  const handleContinue = () => {
    if (!canContinue) return;

    // Construir el objeto de entrega según el tipo
    let deliveryInfo;

    if (method === "pickup" && pickupInfo) {
      deliveryInfo = {
        tipo: "RECOJO_EN_TIENDA",
        almacenOrigen: pickupInfo.almacenOrigen,
        tiendaSeleccionada: pickupInfo.tienda,
        costoEnvio: 0,
        tiempoEstimadoDias: pickupInfo.recojoInfo.tiempo_estimado_dias,
        fechaEntregaEstimada: pickupInfo.recojoInfo.fecha_entrega_estimada,
        descripcion: pickupInfo.recojoInfo.descripcion,
      };
    } else if (carrierInfo) {
      deliveryInfo = {
        tipo: "ENVIO_A_DOMICILIO",
        almacenOrigen: carrierInfo.almacenOrigen,
        carrierSeleccionado: carrierInfo.carrier,
        direccionEnvioId: selectedAddress?.id || null,
      };
    }

    navigate("/checkout/step4", {
      state: {
        method: method,
        passedCart: cart,
        selectedAddress: selectedAddress,
        userInfo: userInfo,
        deliveryInfo: deliveryInfo, // Toda la info necesaria para el JSON final
        costos: {
          subtotal: subtotal,
          impuestos: taxes,
          envio: shippingCost,
          total: total,
        },
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CheckoutSteps currentStep={3} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-10">
          {method === "pickup" ? (
            <section>
              <h1 className="text-3xl font-bold mb-6 text-[#EBC431]">
                Selecciona tu tienda de recojo
              </h1>
              <PickupSelection
                cart={cart.map((item) => ({
                  idProducto: item.idProducto,
                  cantidad: item.cantidad,
                }))}
                onSelectPickupInfo={(info) => setPickupInfo(info)}
              />
            </section>
          ) : (
            <>
              <section>
                <h1 className="text-3xl font-bold mb-6 text-[#EBC431]">
                  Dirección de envío
                </h1>
                <ShippingForm
                  onSelectAddress={(addr) => setSelectedAddress(addr)}
                />
              </section>

              {selectedAddress && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-[#EBC431]">
                    Selecciona el método de envío
                  </h2>
                  <CarrierSelection
                    cart={cart.map((item) => ({
                      idProducto: item.idProducto,
                      cantidad: item.cantidad,
                    }))}
                    destinationAddress={{
                      lat: selectedAddress.latitud,
                      lng: selectedAddress.longitud,
                      direccion: selectedAddress.direccion,
                    }}
                    onSelectCarrier={(info) => setCarrierInfo(info)}
                  />
                </section>
              )}
            </>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6 border-t border-[#C0A648]/40">
            <button
              onClick={() =>
                navigate("/checkout/step2", {
                  state: { passedCart: cart, method: method },
                })
              }
              className="px-6 py-3 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium"
            >
              ← Volver
            </button>

            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`px-6 py-3 rounded-lg border-2 border-[#C0A648] transition font-medium
    ${
      canContinue
        ? "bg-[#F5E27A] text-[#333027] hover:bg-[#EBC431] hover:scale-105 hover:shadow-md cursor-pointer"
        : "bg-[#6B644C]/50 text-gray-400 cursor-not-allowed"
    }`}
            >
              Continuar al pago →
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
              shipping={
                shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`
              }
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