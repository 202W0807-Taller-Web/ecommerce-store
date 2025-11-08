import { useEffect, useState, useRef } from "react";
import { useUserLocation } from "../hooks/useUserLocation";

interface Store {
  id: number;
  nombre: string;
  imagen: string | null;
  direccion: string;
  latitud: number;
  longitud: number;
  distancia_km: number;
}

interface AlmacenOrigen {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

interface RecojoTienda {
  tipo_envio: string;
  costo_envio: number;
  tiempo_estimado_dias: number;
  fecha_entrega_estimada: string;
  descripcion: string;
  disponible: boolean;
  tiendas: Store[];
  mensaje: string;
}

interface ShippingQuoteResponse {
  success: boolean;
  distancia_km: number;
  almacen_origen: AlmacenOrigen;
  recojo_tienda: RecojoTienda;
}

interface CartItem {
  idProducto: number;
  cantidad: number;
}

interface PickupSelectionProps {
  cart: CartItem[];
  onSelectPickupInfo?: (info: {
    tienda: Store;
    almacenOrigen: AlmacenOrigen;
    recojoInfo: RecojoTienda;
  }) => void;
}

// Exportar los tipos para que puedan ser usados en otros componentes
export type { Store, AlmacenOrigen, RecojoTienda };

export default function PickupSelection({ cart, onSelectPickupInfo }: PickupSelectionProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<ShippingQuoteResponse | null>(null);

  const { lat, lng, loading: locationLoading, error: locationError } = useUserLocation();

  const hasFetchedRef = useRef(false);
  const lastRequestRef = useRef<string>("");

  useEffect(() => {
    // Esperar a tener ubicación y carrito antes de hacer el fetch
    if (locationLoading || !lat || !lng || !cart || cart.length === 0) {
      return;
    }

    const requestKey = `${lat}-${lng}-${JSON.stringify(cart.map(c => ({ id: c.idProducto, q: c.cantidad })))}`;

    if (hasFetchedRef.current && lastRequestRef.current === requestKey) {
      return;
    }

    async function fetchStores() {
      setLoading(true);
      setError(null);

      try {
        const productos = cart.map((item) => ({
          id_producto: item.idProducto,
          cantidad: item.cantidad,
        }));

        const res = await fetch(
          "https://shipping-service-814404078279.us-central1.run.app/api/cotizaciones",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              destino_lat: lat,
              destino_lng: lng,
              destino_direccion: "Ubicación del usuario",
              productos: productos,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`Error en la API: ${res.status}`);
        }

        const data: ShippingQuoteResponse = await res.json();

        setQuoteResponse(data);

        if (data?.recojo_tienda?.tiendas) {
          setStores(data.recojo_tienda.tiendas);
        } else {
          setStores([]);
        }

        hasFetchedRef.current = true;
        lastRequestRef.current = requestKey;
      } catch (error) {
        console.error("Error obteniendo tiendas:", error);
        setError("No se pudieron cargar las tiendas disponibles");
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, [lat, lng, cart, locationLoading]);

  const handleStoreSelection = (store: Store) => {
    setSelected(store.id);

    if (quoteResponse && onSelectPickupInfo) {
      onSelectPickupInfo({
        tienda: store,
        almacenOrigen: quoteResponse.almacen_origen,
        recojoInfo: quoteResponse.recojo_tienda,
      });
    }
  };

  if (locationLoading) {
    return (
      <div className="bg-[#413F39]/40 p-6 rounded-2xl shadow-md text-[#F5F5F5]">
        <p className="text-[#EBC431] text-center animate-pulse">
          Obteniendo tu ubicación...
        </p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="bg-[#413F39]/40 p-6 rounded-2xl shadow-md text-[#F5F5F5]">
        <p className="text-red-400 text-center">
          {locationError}
        </p>
        <p className="text-sm text-[#F5F5F5]/60 text-center mt-2">
          Necesitamos tu ubicación para mostrarte las tiendas cercanas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#413F39]/40 p-6 rounded-2xl shadow-md text-[#F5F5F5]">
      {loading ? (
        <p className="text-[#EBC431] text-center animate-pulse">
          Cargando tiendas cercanas...
        </p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : stores.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#F5F5F5]/70 mb-4">
            {stores.length} {stores.length === 1 ? "tienda disponible" : "tiendas disponibles"}
          </p>
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreSelection(store)}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200
                ${
                  selected === store.id
                    ? "border-[#EBC431] bg-[#413F39] shadow-lg"
                    : "border-[#C0A648]/40 bg-[#333027] hover:border-[#EBC431] hover:bg-[#413F39]/60"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-[#EBC431] text-lg">{store.nombre}</p>
                  <p className="text-sm text-[#F5F5F5]/80 mt-1">{store.direccion}</p>
                  <p className="text-xs text-[#C0A648]/70 mt-2">
                    📍 A {store.distancia_km.toFixed(1)} km de distancia
                  </p>
                </div>

                {selected === store.id && (
                  <div className="ml-3">
                    <svg className="w-6 h-6 text-[#EBC431]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 🔹 Banda de confirmación */}
              {selected === store.id && (
                <div className="mt-3 pt-3 border-t border-[#EBC431]/30">
                  <p className="text-sm text-[#EBC431] font-medium">
                    ✓ Tienda seleccionada para recojo
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#EBC431]/70 text-center">
          No se encontraron tiendas disponibles cerca de tu ubicación.
        </p>
      )}
    </div>
  );
}