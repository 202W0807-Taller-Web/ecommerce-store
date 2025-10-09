import { useEffect, useState } from 'react';
import { getMisPedidos } from '../services/ordersApi';

export function usePedidos() {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });

    useEffect(() => {
        getMisPedidos('user-7823110').then(response => {
        setPedidos(response.data);
        setMeta({ total: response.total, page: response.page, lastPage: response.lastPage });
        setLoading(false);
        });
    }, []);

    return { pedidos,meta,loading };
}
