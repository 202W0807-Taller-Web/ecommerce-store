import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAddresses } from '../../hooks/useAddresses';
import type { Address, AddressForm } from '../../entities';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAddresses', () => {
  const apiUrl = 'http://localhost:3000/api/envio';
  const idUsuarioEnvio = 20;

  const mockAddresses: Address[] = [
    {
      id: 1,
      direccionLinea1: 'Calle Principal 123',
      direccionLinea2: 'Apt 4B',
      ciudad: 'Lima',
      provincia: 'Lima',
      codigoPostal: '15001',
      pais: 'Perú',
      principal: true,
    },
    {
      id: 2,
      direccionLinea1: 'Avenida Secundaria 456',
      ciudad: 'Cusco',
      provincia: 'Cusco',
      codigoPostal: '08000',
      pais: 'Perú',
      principal: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch addresses on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddresses,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.addresses).toEqual(mockAddresses);
    expect(result.current.error).toBe(null);
  });

  it('should not fetch if idUsuarioEnvio is null', async () => {
    const { result } = renderHook(() => useAddresses(apiUrl, null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.addresses).toEqual([]);
  });

  it('should handle fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('should create new address', async () => {
    const newAddress: AddressForm = {
      direccionLinea1: 'Nueva Dirección 789',
      ciudad: 'Arequipa',
      provincia: 'Arequipa',
      codigoPostal: '04000',
      pais: 'Perú',
      principal: false,
    };

    const createdAddress: Address = {
      id: 3,
      ...newAddress,
    };

    // Mock para fetch inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddresses,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    await waitFor(() => {
      expect(result.current.addresses).toEqual(mockAddresses);
    });

    // Mock para createAddress
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createdAddress,
    });

    await result.current.createAddress(newAddress);

    await waitFor(() => {
      expect(result.current.addresses.length).toBe(3);
      expect(result.current.addresses[2]).toEqual(createdAddress);
    });
  });

  it('should update existing address', async () => {
    const updatedData: Partial<AddressForm> = {
      direccionLinea2: 'Piso 5',
    };

    const updatedAddress: Address = {
      ...mockAddresses[0],
      ...updatedData,
    };

    // Mock para fetch inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddresses,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    await waitFor(() => {
      expect(result.current.addresses).toEqual(mockAddresses);
    });

    // Mock para updateAddress
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedAddress,
    });

    await result.current.updateAddress(1, updatedData);

    await waitFor(() => {
      expect(result.current.addresses[0].direccionLinea2).toBe('Piso 5');
    });
  });

  it('should delete address', async () => {
    // Mock para fetch inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddresses,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    await waitFor(() => {
      expect(result.current.addresses).toEqual(mockAddresses);
    });

    // Mock para deleteAddress
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await result.current.deleteAddress(1);

    await waitFor(() => {
      expect(result.current.addresses.length).toBe(1);
      expect(result.current.addresses.find(a => a.id === 1)).toBeUndefined();
    });
  });

  it('should mark address as primary', async () => {
    // Mock para fetch inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddresses,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    await waitFor(() => {
      expect(result.current.addresses).toEqual(mockAddresses);
    });

    // Mock para markAsPrimary
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await result.current.markAsPrimary(2);

    await waitFor(() => {
      expect(result.current.addresses[0].principal).toBe(false);
      expect(result.current.addresses[1].principal).toBe(true);
    });
  });

  it('should handle optimistic update rollback on error', async () => {
    // Mock para fetch inicial
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAddresses,
    });

    const { result } = renderHook(() => useAddresses(apiUrl, idUsuarioEnvio));

    await waitFor(() => {
      expect(result.current.addresses).toEqual(mockAddresses);
    });

    // Mock para deleteAddress con error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await result.current.deleteAddress(1);

    await waitFor(() => {
      // Debe revertir al estado original
      expect(result.current.addresses).toEqual(mockAddresses);
      expect(result.current.error).toBeTruthy();
    });
  });
});
