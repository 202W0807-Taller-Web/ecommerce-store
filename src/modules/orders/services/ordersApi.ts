// src/orders/services/ordersApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api/orders';

export async function getMisPedidos(usuarioId: string, page = 1, limit = 5) {
    try {
        const response = await axios.get(`${API_BASE_URL}/usuario/${usuarioId}`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los pedidos del usuario:', error);
        return [];
    }
}

// --- FUNCIÓN AÑADIDA ---
export async function getPedidoById(orderId: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orderId}`);
        // Mock data para completar la vista de detalle
        const mockDetails = {
            envio: { nombre: "Nombre Usuario", direccion: "Dirección de domicilio" },
            pago: { metodo: "Transferencia via Pago Efectivo", fecha: new Date('2025-08-10'), referencia: "#1072894317" },
            articulosDetallados: [
                { id: 1, nombre: "Maillot para hombre", marca: "Rockbros", precio: 100.00, imagen: "https://i.imgur.com/G42P0v2.png", devolucionEligibleHasta: "2025-08-27" },
                { id: 2, nombre: "Casco negro", marca: "Rockbros", precio: 80.00, imagen: "https://i.imgur.com/B942s0b.png", devolucionEligibleHasta: "2025-08-27" },
                { id: 3, nombre: "Guantes cortos", marca: "Rockbros", precio: 80.00, imagen: "https://i.imgur.com/vHqB3qC.png", devolucionEligibleHasta: "2025-08-27" }
            ],
            resumenCompra: { subtotal: 260.00, descuento: -10.00, envio: 0.00, total: 250.00 }
        };
        return { ...response.data, ...mockDetails };
    } catch (error) {
        console.error(`Error al obtener el pedido ${orderId}:`, error);
        return null;
    }
}
