import { useEffect, useState } from "react";

interface UserLocation {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Obtiene la ubicación del usuario usando Geolocation API o, en su defecto, IP pública.
 * Retorna { lat, lng, loading, error }.
 */
export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function getLocation() {
      // Intenta primero con geolocalización del navegador
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              loading: false,
              error: null,
            });
          },
          async () => {
            // Si falla o el usuario niega permiso, usar IP
            try {
              const res = await fetch("https://ipapi.co/json/");
              const data = await res.json();
              setLocation({
                lat: data.latitude,
                lng: data.longitude,
                loading: false,
                error: null,
              });
            } catch (err) {
              setLocation({
                lat: null,
                lng: null,
                loading: false,
                error: "No se pudo obtener la ubicación por IP.",
              });
            }
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        // Si el navegador no soporta geolocalización
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          setLocation({
            lat: data.latitude,
            lng: data.longitude,
            loading: false,
            error: null,
          });
        } catch (err) {
          setLocation({
            lat: null,
            lng: null,
            loading: false,
            error: "No se pudo obtener ubicación por IP.",
          });
        }
      }
    }

    getLocation();
  }, []);

  return location;
}
