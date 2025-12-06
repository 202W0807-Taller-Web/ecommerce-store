import { Link, useLocation, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
import ShippingForm from "../components/shippingForm";
import PickupSelection from "../components/pickupSelection";
import CarrierSelection from "../components/carrierSelection";
import { useState } from "react";
import type {
  Address,
  Carrier,
  AlmacenOrigen,
  Store,
  RecojoTienda,
} from "../entities";

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

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [pickupInfo, setPickupInfo] = useState<{
    tienda: Store;
    almacenOrigen: AlmacenOrigen;
    recojoInfo: RecojoTienda;
  } | null>(null);
  const [carrierInfo, setCarrierInfo] = useState<{
    carrier: Carrier;
    almacenOrigen: AlmacenOrigen;
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

  let shippingCost = 0;
  if (method === "pickup") {
    shippingCost = 0; // Recojo en tienda siempre es gratis
  } else if (carrierInfo) {
    shippingCost = carrierInfo.carrier.costo_envio;
  }

  const total = subtotal + shippingCost;

  const canContinue =
    method === "pickup"
      ? pickupInfo !== null
      : selectedAddress !== null && carrierInfo !== null;

  const handleContinue = () => {
    if (!canContinue) return;

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

    navigate("/cart/checkout/step4", {
      state: {
        method: method,
        passedCart: cart,
        selectedAddress: selectedAddress,
        userInfo: userInfo,
        deliveryInfo: deliveryInfo,
        costos: {
          subtotal: subtotal,
          envio: shippingCost,
          total: total,
        },
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <CheckoutSteps currentStep={3} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-12">
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
                <ShippingForm onSelectAddress={(addr) => setSelectedAddress(addr)} />
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
                      direccion:
                        selectedAddress.direccion ?? selectedAddress.direccionLinea1,
                    }}
                    onSelectCarrier={(info) => setCarrierInfo(info)}
                  />
                </section>
              )}
            </>
          )}

          <div className="flex justify-between pt-6 border-t border-[#C0A648]/40">
            <button
              onClick={() =>
                navigate("/cart/checkout/step2", {
                  state: { passedCart: cart, method: method },
                })
              }
              className="px-8 py-4 rounded-lg border-2 border-[#C0A648] text-[#EBC431] bg-[#333027] hover:bg-[#413F39]/80 hover:scale-105 hover:border-[#EBC431] transition font-medium"
            >
              ← Volver
            </button>

            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`px-8 py-4 rounded-lg border-2 border-[#C0A648] transition font-semibold text-center ${
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
        <div className="md:sticky md:top-8 p-8 bg-[#2E2B24] rounded-2xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-[#EBC431] mb-4">Resumen del pedido</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.idProducto}
                className="flex justify-between items-center p-4 bg-[#413F39]/20 rounded-xl"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[#F5F5F5]">{item.nombre || `Producto #${item.idProducto}`}</span>
                  <span className="text-[#F5F5F5]/70 text-sm">
                    Cantidad: {item.cantidad} × ${item.precio.toFixed(2)}
                  </span>
                </div>
                <span className="font-semibold text-[#EBC431]">
                  ${(item.cantidad * item.precio).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#C0A648]/40 pt-4 space-y-2 text-lg">
            <div className="flex justify-between">
              <span className="text-[#F5F5F5]/80">Subtotal</span>
              <span className="font-semibold text-[#EBC431]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F5F5F5]/80">Envío</span>
              <span className="font-semibold text-[#EBC431]">
                {shippingCost === 0 ? (
                  <span className="text-green-400 font-semibold">GRATIS</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2">
              <span>Total</span>
              <span className="text-yellow-400 font-extrabold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
