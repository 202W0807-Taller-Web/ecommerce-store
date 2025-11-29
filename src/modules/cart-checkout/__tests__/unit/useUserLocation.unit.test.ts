import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserLocation } from '../../hooks/useUserLocation';

const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

const mockFetch = vi.fn();

describe('useUserLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mockear navigator.geolocation usando Object.defineProperty
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    global.fetch = mockFetch;
    process.env.VITE_API_INVENTORY_URL = "http://localhost:3001";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get location from browser geolocation', async () => {
    const mockPosition = {
      coords: {
        latitude: -12.0464,
        longitude: -77.0428,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      // Simular respuesta asíncrona
      setTimeout(() => success(mockPosition), 0);
    });

    const { result } = renderHook(() => useUserLocation());

    // Inicialmente debe estar en loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lat).toBe(-12.0464);
    expect(result.current.lng).toBe(-77.0428);
    expect(result.current.error).toBe(null);
  });

  it('should fallback to API when geolocation fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      // Simular error asíncrono
      setTimeout(() => error(new Error('User denied geolocation')), 0);
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        lat: -12.0464,
        lng: -77.0428,
      }),
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lat).toBe(-12.0464);
    expect(result.current.lng).toBe(-77.0428);
    expect(result.current.error).toBe(null);
  });

  it('should handle missing geolocation API', async () => {
    // Redefinir navigator sin geolocation
    const originalNavigator = global.navigator;

    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 1000 }
    );

    expect(result.current.lat).toBe(null);
    expect(result.current.lng).toBe(null);
    expect(result.current.error).toBe('No se pudo obtener ubicación.');

    // Restaurar el navigator original
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });
});
