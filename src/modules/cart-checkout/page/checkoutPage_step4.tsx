import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckoutSteps from "../components/checkoutSteps";
import { useOrdersService } from "../hooks/useOrdersService";
import { useCart } from "../hooks/useCart";
import type { Address, Carrier, AlmacenOrigen, Store } from "../entities";

type CartItem = {
  idProducto: number;
  nombre: string | null;
  cantidad: number;
  precio: number;
  imagen?: string;
};

type UserInfo = {
  nombreCompleto: string;
  email: string;
  telefono: string;
};

type DeliveryInfo = {
  tipo: "RECOJO_EN_TIENDA" | "ENVIO_A_DOMICILIO";
  almacenOrigen: AlmacenOrigen;
  tiendaSeleccionada?: Store;
  carrierSeleccionado?: Carrier;
  costoEnvio?: number;
  tiempoEstimadoDias?: number;
  fechaEntregaEstimada?: string;
  descripcion?: string;
  direccionEnvioId?: number;
};

export default function Checkout_Step4() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [costos, setCostos] = useState<any>(null);
  const [method, setMethod] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { createOrder} = useOrdersService();
  const { clearCart } = useCart();

  useEffect(() => {
    const state = location.state;
    if (state) {
      setCart(state.passedCart || []);
      setAddress(state.selectedAddress || null);
      setUserInfo(state.userInfo || null);
      setDeliveryInfo(state.deliveryInfo || null);
      setCostos(state.costos || null);
      setMethod(state.method || "");
    }
  }, [location.state]);

  const handleConfirm = async () => {
    if (!userInfo || !deliveryInfo || !cart.length) {
      alert("Faltan datos requeridos para confirmar el pedido.");
      return;
    }

    setIsLoading(true);

    // Construir el objeto de entrega según el tipo
    const entregaPayload =
      deliveryInfo.tipo === "RECOJO_EN_TIENDA"
        ? {
            tipo: "RECOJO_TIENDA",
            almacenOrigen: deliveryInfo.almacenOrigen,
            tiendaSeleccionada: deliveryInfo.tiendaSeleccionada,
            costoEnvio: 0.0,
            tiempoEstimadoDias: deliveryInfo.tiempoEstimadoDias ?? 0,
            fechaEntregaEstimada: deliveryInfo.fechaEntregaEstimada,
            descripcion: deliveryInfo.descripcion,
          }
        : {
            tipo: "DOMICILIO",
            almacenOrigen: deliveryInfo.almacenOrigen,
            carrierSeleccionado: deliveryInfo.carrierSeleccionado,
            direccionEnvioId: deliveryInfo.direccionEnvioId ?? address?.id,
          };

    // OBJETO PARA EL NUEVO ENDPOINT
    const orderPayload = {
      usuarioId: 20, // Temporalmente hardcodeado
      direccionEnvio: {
        nombreCompleto: userInfo.nombreCompleto,
        telefono: userInfo.telefono,
        direccionLinea1: address?.direccionLinea1 ?? "",
        direccionLinea2: address?.direccionLinea2 ?? "",
        ciudad: address?.ciudad ?? "",
        provincia: address?.provincia ?? "",
        codigoPostal: address?.codigoPostal ?? "",
        pais: address?.pais ?? "",
      },
      items: cart.map((it) => ({
        productoId: it.idProducto,
        nombreProducto: it.nombre ?? `Producto #${it.idProducto}`,
        cantidad: it.cantidad,
        precioUnitario: it.precio,
        subTotal: it.precio * it.cantidad,
      })),
      costos: costos || {
        subtotal: cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
        impuestos: 0,
        envio: deliveryInfo?.costoEnvio ?? 0,
        total:
          cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0) +
          (deliveryInfo?.costoEnvio ?? 0),
      },
      entrega: entregaPayload,
      metodoPago: "SIMULADO",
      estadoInicial: "PENDIENTE",
    };

    console.log("🟡 Enviando pedido a API:", orderPayload);

    try {
      const res = await createOrder(orderPayload);

      if (res?.success) {
        await clearCart();

        // Navegar al success
        navigate("/checkout/success", {
          replace: true,
          state: { order: res.data },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un error al crear la orden.");
    }
  };

  const total =
    costos?.total ??
    cart.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

  return (
    <div className="max-w-5xl mx-auto bg-[#333027] p-8 rounded-2xl shadow-2xl text-[#F5F5F5] space-y-8 border border-[#C0A648]/30">
      <CheckoutSteps currentStep={4} />

      <h2 className="text-3xl font-bold text-center text-[#EBC431] mb-8">
        Confirmar Pedido
      </h2>

      <section>
        <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
          Productos del carrito
        </h3>
        {cart.length === 0 ? (
          <p className="italic text-[#F5F5F5]/70">
            No hay productos en el carrito.
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.idProducto}
                className="flex justify-between border-b border-[#6B644C]/50 pb-3"
              >
                <div className="flex gap-4">
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.nombre || "Producto"}
                      className="w-16 h-16 rounded-lg object-cover border border-[#C0A648]/30"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{item.nombre}</p>
                    <p className="text-sm text-[#F5F5F5]/70">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-[#EBC431]">
                  S/. {(item.cantidad * item.precio).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {deliveryInfo && (
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
            Detalles de entrega
          </h3>

          {deliveryInfo.tipo === "RECOJO_EN_TIENDA" ? (
            <div className="space-y-3 bg-[#413F39]/70 p-4 rounded-lg border border-[#C0A648]/40">
              <p>
                <strong className="text-[#EBC431]">Tipo:</strong> Recojo en
                tienda
              </p>
              <p>
                <strong className="text-[#EBC431]">Tienda:</strong>{" "}
                {deliveryInfo.tiendaSeleccionada?.nombre}
              </p>
              <p>
                <strong className="text-[#EBC431]">Dirección:</strong>{" "}
                {deliveryInfo.tiendaSeleccionada?.direccion}
              </p>
              <p>
                <strong className="text-[#EBC431]">Descripción:</strong>{" "}
                {deliveryInfo.descripcion}
              </p>
              <p>
                <strong className="text-[#EBC431]">Fecha estimada:</strong>{" "}
                {new Date(
                  deliveryInfo.fechaEntregaEstimada ?? ""
                ).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="space-y-3 bg-[#413F39]/70 p-4 rounded-lg border border-[#C0A648]/40">
              <p>
                <strong className="text-[#EBC431]">Tipo:</strong> Envío a
                domicilio
              </p>
              <p>
                <strong className="text-[#EBC431]">Transportista:</strong>{" "}
                {deliveryInfo.carrierSeleccionado?.carrier_nombre} (
                {deliveryInfo.carrierSeleccionado?.carrier_codigo})
              </p>
              <p>
                <strong className="text-[#EBC431]">Costo envío:</strong> S/.{" "}
                {deliveryInfo.carrierSeleccionado?.costo_envio.toFixed(2)}
              </p>
              <p>
                <strong className="text-[#EBC431]">Entrega estimada:</strong>{" "}
                {new Date(
                  deliveryInfo.carrierSeleccionado?.fecha_entrega_estimada ?? ""
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </section>
      )}

      {method === "carrier" && address && (
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
            Dirección de envío
          </h3>
          <div className="p-4 border border-[#C0A648]/40 rounded-lg bg-[#413F39]/70">
            <p>{address.direccionLinea1}</p>
            {address.direccionLinea2 && <p>{address.direccionLinea2}</p>}
            <p>
              {address.ciudad}, {address.provincia}, {address.pais}
            </p>
            <p>Código postal: {address.codigoPostal}</p>
          </div>
        </section>
      )}

      {userInfo && (
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
            Información del usuario
          </h3>
          <div className="p-4 border border-[#C0A648]/40 rounded-lg bg-[#413F39]/70 space-y-1">
            <p>
              <strong className="text-[#EBC431]">Nombre:</strong>{" "}
              {userInfo.nombreCompleto}
            </p>
            <p>
              <strong className="text-[#EBC431]">Email:</strong>{" "}
              {userInfo.email}
            </p>
            <p>
              <strong className="text-[#EBC431]">Teléfono:</strong>{" "}
              {userInfo.telefono}
            </p>
          </div>
        </section>
      )}

      <section className="pt-6 border-t border-[#C0A648]/40">
        <div className="flex justify-between text-xl font-semibold">
          <span>Total a pagar:</span>
          <span className="text-[#EBC431]">S/. {total.toFixed(2)}</span>
        </div>
      </section>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => navigate(-1)}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-[#6B644C] text-[#F5F5F5] hover:bg-[#968751] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volver
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-[#EBC431] text-[#333027] font-semibold hover:bg-[#C0A648] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Procesando..." : "Confirmar pedido"}
        </button>
      </div>
    </div>
  );
}
