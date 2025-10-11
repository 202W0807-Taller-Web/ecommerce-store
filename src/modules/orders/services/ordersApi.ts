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

// --- MODIFICACIÓN EN ESTA FUNCIÓN ---
export async function getPedidoById(orderId: string) {
    try {
        // Asumimos que el endpoint para un pedido es /api/orders/:orderId
        const response = await axios.get(`${API_BASE_URL}/${orderId}`);
        
        // ¡YA NO HAY MOCK! Simplemente devolvemos los datos reales del backend.
        return response.data;

    } catch (error) {
        console.error(`Error al obtener el pedido ${orderId}:`, error);
        return null;
    }
}
