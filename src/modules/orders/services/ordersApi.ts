// src/orders/services/ordersApi.ts
import axios from 'axios';


const API_BASE_URL =
    import.meta.env.MODE === "production"
        ? "https://orders-query-833583666995.us-central1.run.app"
        : "http://localhost:3002";

export async function getMisPedidos(usuarioId: number, page = 1, limit = 5,filter="todos",search="") {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/orders/usuario/${usuarioId}`, {
            params: { page, limit, filter, search   },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los pedidos del usuario:', error);
        throw error;
    }
}

// --- MODIFICACIÓN EN ESTA FUNCIÓN ---
export async function getPedidoById(orderId: string) {
    try {
        // Asumimos que el endpoint para un pedido es /api/orders/:orderId
        const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
        
        // ¡YA NO HAY MOCK! Simplemente devolvemos los datos reales del backend.
        return response.data;

    } catch (error) {
        console.error(`Error al obtener el pedido ${orderId}:`, error);
        return null;
    }
}
