import { useEffect, useState, useRef } from "react";
import { useUserLocation } from "../hooks/useUserLocation";
import type { Carrier, AlmacenOrigen, ShippingQuoteResponse } from "../entities";

interface CartItem {
  idProducto: number;
  cantidad: number;
}

interface CarrierSelectionProps {
  cart: CartItem[];
  destinationAddress?: {
    lat?: number;
    lng?: number;
    direccion: string;
  };
  onSelectCarrier?: (info: {
    carrier: Carrier;
    almacenOrigen: AlmacenOrigen;
    distanciaKm: number;
  }) => void;
}

export default function CarrierSelection({
  cart,
  destinationAddress,
  onSelectCarrier,
}: CarrierSelectionProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<ShippingQuoteResponse | null>(null);

  const userLocation = useUserLocation();

  const hasFetchedRef = useRef(false);
  const lastRequestRef = useRef<string>("");

  // Usar ubicación del usuario o la dirección específica
  const lat = destinationAddress?.lat ?? userLocation.lat;
  const lng = destinationAddress?.lng ?? userLocation.lng;
  const locationLoading = userLocation.loading;
  const locationError = userLocation.error;

  useEffect(() => {
    if (locationLoading || !lat || !lng || !cart || cart.length === 0) {
      return;
    }

    const requestKey = `${lat}-${lng}-${JSON.stringify(cart)}`;

    if (hasFetchedRef.current && lastRequestRef.current === requestKey) {
      return;
    }

    async function fetchCarriers() {
      setLoading(true);
      setError(null);

      try {
        const productos = cart.map((item) => ({
          id_producto: item.idProducto,
          cantidad: item.cantidad,
        }));

        const res = await fetch(
          `${import.meta.env.VITE_API_SHIPPING_URL}/api/cotizaciones`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              destino_lat: lat,
              destino_lng: lng,
              destino_direccion: destinationAddress?.direccion || "Ubicación del usuario",
              productos: productos,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`Error en la API: ${res.status}`);
        }

        const data: ShippingQuoteResponse = await res.json();

        setQuoteResponse(data);

        if (data?.domicilio?.carriers) {
          setCarriers(data.domicilio.carriers);
        } else {
          setCarriers([]);
        }

        hasFetchedRef.current = true;
        lastRequestRef.current = requestKey;
      } catch (error) {
        console.error("Error obteniendo carriers:", error);
        setError("No se pudieron cargar las opciones de envío");
      } finally {
        setLoading(false);
      }
    }

    fetchCarriers();
  }, [lat, lng, cart, locationLoading, destinationAddress]);

  const handleCarrierSelection = (carrier: Carrier) => {
    setSelected(carrier.cotizacion_id);

    if (quoteResponse && onSelectCarrier) {
      onSelectCarrier({
        carrier: carrier,
        almacenOrigen: quoteResponse.almacen_origen,
        distanciaKm: quoteResponse.distancia_km,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (locationLoading) {
    return (
      <div className="bg-[#413F39]/40 p-6 rounded-2xl shadow-md text-[#F5F5F5]">
        <p className="text-[#EBC431] text-center animate-pulse">
          Obteniendo información de envío...
        </p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="bg-[#413F39]/40 p-6 rounded-2xl shadow-md text-[#F5F5F5]">
        <p className="text-red-400 text-center">{locationError}</p>
        <p className="text-sm text-[#F5F5F5]/60 text-center mt-2">
          Necesitamos tu ubicación para calcular el envío
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#413F39]/40 p-6 rounded-2xl shadow-md text-[#F5F5F5]">
      {loading ? (
        <p className="text-[#EBC431] text-center animate-pulse">
          Calculando opciones de envío...
        </p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : carriers.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#F5F5F5]/70 mb-4">
            {carriers.length} {carriers.length === 1 ? "opción" : "opciones"} de envío disponibles
          </p>
          {carriers.map((carrier) => (
            <div
              key={carrier.cotizacion_id}
              onClick={() => handleCarrierSelection(carrier)}
              className={`p-4 border rounded-xl cursor-pointer transition
                ${
                  selected === carrier.cotizacion_id
                    ? "border-[#EBC431] bg-[#413F39]"
                    : "border-[#C0A648]/40 bg-[#333027] hover:border-[#EBC431] hover:bg-[#413F39]/60"
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  {carrier.logo_url && (
                    <img
                      src={carrier.logo_url}
                      alt={carrier.carrier_nombre}
                      className="h-8 w-auto object-contain"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-[#EBC431]">
                      {carrier.carrier_nombre}
                    </p>
                    <p className="text-xs text-[#C0A648]/70">
                      {carrier.carrier_tipo}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#EBC431] text-lg">
                    ${carrier.costo_envio.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-[#F5F5F5]/80 mt-3">
                <div>
                  <p className="text-xs text-[#C0A648]/70">Tiempo estimado:</p>
                  <p>{carrier.tiempo_estimado_dias} días</p>
                </div>
                <div>
                  <p className="text-xs text-[#C0A648]/70">Entrega estimada:</p>
                  <p>{formatDate(carrier.fecha_entrega_estimada)}</p>
                </div>
              </div>

              <div className="mt-2 text-xs text-[#F5F5F5]/60">
                <p>Peso máximo: {carrier.peso_maximo_kg} kg</p>
                <p>Distancia: {carrier.distancia_km.toFixed(1)} km</p>
              </div>

              {selected === carrier.cotizacion_id && (
                <div className="mt-3 flex items-center gap-2 text-[#EBC431]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Seleccionado</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#EBC431]/70 text-center">
          No hay opciones de envío disponibles para tu ubicación.
        </p>
      )}
    </div>
  );
}