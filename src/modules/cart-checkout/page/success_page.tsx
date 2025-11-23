import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type OrderData = {
  id?: string;
  numeroOrden?: string;
  estadoInicial?: string;
  entrega?: {
    tipo: string;
    fechaEntregaEstimada?: string;
    tiendaSeleccionada?: {
      nombre: string;
      direccion: string;
    };
    carrierSeleccionado?: {
      carrier_nombre: string;
    };
  };
  costos?: {
    total: number;
  };
};

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const state = location.state;
    if (state?.orderData) {
      setOrderData(state.orderData);
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleViewOrders = () => {
    navigate("/mis-pedidos", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2820] to-[#1a1815] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#333027] rounded-3xl shadow-2xl border border-[#C0A648]/30 overflow-hidden">
        {/* Header con animación de éxito */}
        <div className="bg-gradient-to-r from-[#EBC431] to-[#C0A648] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <svg className="w-12 h-12 text-[#EBC431]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-[#333027] mb-2">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-[#333027]/80 text-lg">
              Tu orden ha sido procesada exitosamente
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8 space-y-6">
          {/* Número de orden */}
          {orderData?.numeroOrden && (
            <div className="bg-[#413F39]/50 rounded-xl p-6 border border-[#C0A648]/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-[#EBC431]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-xl font-semibold text-[#F5F5F5]">
                  Número de Orden
                </h2>
              </div>
              <p className="text-3xl font-bold text-[#EBC431] ml-9">
                {orderData.numeroOrden}
              </p>
              <p className="text-sm text-[#F5F5F5]/60 ml-9 mt-1">
                Guarda este número para rastrear tu pedido
              </p>
            </div>
          )}

          {/* Información de entrega */}
          {orderData?.entrega && (
            <div className="bg-[#413F39]/50 rounded-xl p-6 border border-[#C0A648]/20">
              <div className="space-y-4">
                {/* Tipo de entrega */}
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#EBC431] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#F5F5F5]/70 mb-1">
                      Método de entrega
                    </p>
                    <p className="text-lg font-semibold text-[#F5F5F5]">
                      {orderData.entrega.tipo === "RECOJO_TIENDA"
                        ? "Recojo en Tienda"
                        : "Envío a Domicilio"}
                    </p>
                    
                    {orderData.entrega.tipo === "RECOJO_TIENDA" &&
                      orderData.entrega.tiendaSeleccionada && (
                        <div className="mt-2 text-[#F5F5F5]/80">
                          <p className="font-medium">
                            {orderData.entrega.tiendaSeleccionada.nombre}
                          </p>
                          <p className="text-sm text-[#F5F5F5]/60">
                            {orderData.entrega.tiendaSeleccionada.direccion}
                          </p>
                        </div>
                      )}
                    
                    {orderData.entrega.tipo === "DOMICILIO" &&
                      orderData.entrega.carrierSeleccionado && (
                        <p className="text-[#F5F5F5]/80 mt-2">
                          Transportista:{" "}
                          <span className="font-medium">
                            {orderData.entrega.carrierSeleccionado.carrier_nombre}
                          </span>
                        </p>
                      )}
                  </div>
                </div>

                {/* Fecha estimada de entrega */}
                {orderData.entrega.fechaEntregaEstimada && (
                  <div className="flex items-start gap-3 pt-4 border-t border-[#6B644C]/50">
                    <svg className="w-6 h-6 text-[#EBC431] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-[#F5F5F5]/70 mb-1">
                        Fecha estimada de entrega
                      </p>
                      <p className="text-lg font-semibold text-[#F5F5F5]">
                        {new Date(
                          orderData.entrega.fechaEntregaEstimada
                        ).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total pagado */}
          {orderData?.costos?.total && (
            <div className="bg-gradient-to-r from-[#413F39]/70 to-[#413F39]/50 rounded-xl p-6 border border-[#C0A648]/30">
              <div className="flex justify-between items-center">
                <span className="text-lg text-[#F5F5F5]/80">Total pagado:</span>
                <span className="text-3xl font-bold text-[#EBC431]">
                  S/. {orderData.costos.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Mensaje informativo */}
          <div className="bg-[#EBC431]/10 border border-[#EBC431]/30 rounded-xl p-4">
            <p className="text-[#F5F5F5] text-center text-sm leading-relaxed">
              📧 Te hemos enviado un correo con los detalles de tu pedido.
              <br />
              Recibirás notificaciones sobre el estado de tu entrega.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleViewOrders}
              className="flex-1 px-6 py-4 rounded-xl bg-[#6B644C] text-[#F5F5F5] font-semibold hover:bg-[#968751] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Ver mis pedidos
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex-1 px-6 py-4 rounded-xl bg-[#EBC431] text-[#333027] font-semibold hover:bg-[#C0A648] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}