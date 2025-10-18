import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckoutSteps from "../components/checkoutSteps";

type CartItem = {
  id: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  imagen?: string;
};

type Address = {
  direccionLinea1: string;
  direccionLinea2?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  principal: boolean;
};

type UserInfo = {
  nombreCompleto: string;
  email: string;
  telefono: string;
};

export default function Checkout_Step4() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const state = location.state;
    if (state) {
      setCart(state.passedCart || []);
      setAddress(state.selectedAddress || null);
      setUserInfo(state.userInfo || null);
    }
  }, [location.state]);

  const total = cart.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario,
    0
  );

  const handleConfirm = () => {
    console.log("Confirmando pedido...");
    navigate("/checkout/success", { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#333027] p-8 rounded-2xl shadow-2xl text-[#F5F5F5] space-y-8 border border-[#C0A648]/30">
      <CheckoutSteps currentStep={4} />

      <h2 className="text-3xl font-bold text-center text-[#EBC431] mb-8">
        Confirmar Pedido
      </h2>

      <section>
        <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
          Resumen del carrito
        </h3>
        {cart.length === 0 ? (
          <p className="italic text-[#F5F5F5]/70">
            No hay productos en el carrito.
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-[#6B644C]/50 pb-3"
              >
                <div className="flex gap-4">
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
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
                  S/. {(item.cantidad * item.precioUnitario).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
          Dirección de envío
        </h3>
        {address ? (
          <div className="p-4 border border-[#C0A648]/40 rounded-lg bg-[#413F39]/70">
            <p>{address.direccionLinea1}</p>
            {address.direccionLinea2 && <p>{address.direccionLinea2}</p>}
            <p>
              {address.ciudad}, {address.provincia}, {address.pais}
            </p>
            <p>Código postal: {address.codigoPostal}</p>
          </div>
        ) : (
          <p className="italic text-[#F5F5F5]/70">
            No se ha seleccionado dirección.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4 text-[#EBC431]/90">
          Información del usuario
        </h3>
        {userInfo ? (
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
        ) : (
          <p className="italic text-[#F5F5F5]/70">
            No hay información del usuario.
          </p>
        )}
      </section>

      <section className="pt-6 border-t border-[#C0A648]/40">
        <div className="flex justify-between text-xl font-semibold">
          <span>Total a pagar:</span>
          <span className="text-[#EBC431]">S/. {total.toFixed(2)}</span>
        </div>
      </section>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-lg bg-[#6B644C] text-[#F5F5F5] hover:bg-[#968751] transition-all"
        >
          Volver
        </button>

        <button
          onClick={handleConfirm}
          className="px-6 py-3 rounded-lg bg-[#EBC431] text-[#333027] font-semibold hover:bg-[#C0A648] hover:scale-105 transition-all"
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}
