// src/orders/hooks/usePedidoDetail.ts
import { useEffect, useState } from 'react';
import { getPedidoById } from '../services/ordersApi';

export function usePedidoDetail(orderId: string | undefined) {
    const [pedido, setPedido] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError("No se proporcionó un ID de pedido.");
            return;
        }

        const fetchPedido = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPedidoById(orderId);
                if (response) setPedido(response);
                else setError(`No se encontró el pedido con ID ${orderId}.`);
            } catch (err) {
                setError("Ocurrió un error al cargar el pedido.");
            } finally {
                setLoading(false);
            }
        };

        fetchPedido();
    }, [orderId]);

    return { pedido, loading, error };
}