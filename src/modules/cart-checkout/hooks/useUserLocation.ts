import { useEffect, useState } from "react";
import type { UserLocation } from "../entities";

export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function getLocation() {
      try {
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
              const baseUrl = import.meta.env.VITE_API_CART_CHECKOUT_URL;
              const res = await fetch(`${baseUrl}/api/location`);
              const data = await res.json();

              if (data.error) throw new Error(data.error);
              setLocation({
                lat: data.lat,
                lng: data.lng,
                loading: false,
                error: null,
              });
            },
            { enableHighAccuracy: false, timeout: 5000 }
          );
        } else {
          throw new Error("Geolocalización no disponible en este navegador.");
        }
      } catch (err) {
        setLocation({
          lat: null,
          lng: null,
          loading: false,
          error: "No se pudo obtener ubicación.",
        });
      }
    }

    getLocation();
  }, []);

  return location;
}
