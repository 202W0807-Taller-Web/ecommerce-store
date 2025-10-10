import axios from 'axios';

// Puedes configurar la URL base si tienes varias llamadas
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
