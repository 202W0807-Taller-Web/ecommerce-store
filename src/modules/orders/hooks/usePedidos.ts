import { useEffect, useState } from 'react';
import { getMisPedidos } from '../services/ordersApi';

export function usePedidos(page = 1, limit = 5) {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });

    useEffect(() => {
        getMisPedidos(123, page, limit).then(response => {
        setPedidos(response.data);
        setMeta({ total: response.total, page: response.page, lastPage: response.lastPage });
        setLoading(false);
        });
    }, [page]);

    return { pedidos,meta,loading };
}
