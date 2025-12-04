/**
 * Entidades relacionadas con ubicación geográfica
 */

export interface UserLocation {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}
