import { useEffect, useState } from 'react';
import { getMisPedidos } from '../services/ordersApi';
import { useAuth } from './useAuth';

export function usePedidos(page = 1, limit = 5,filter = "todos",search="") {
    const { user, isAuth } = useAuth(); 
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!isAuth || !user?.id) {
            setPedidos([]);
            setMeta({ total: 0, page, lastPage: 1 });
            setLoading(false);
            return;
        }
        setLoading(true);
        // setError(null); 

        getMisPedidos(user.id, page, limit,filter,search)
            .then(response => {
                setPedidos(response.data || []);
                setMeta({
                    total: response.total || 0,
                    page: response.page || page,
                    lastPage: response.lastPage || 1,
                });
                setError(null);
            })
            .catch(err => {
                console.error("Error cargando pedidos:", err);
                setError("No se pudieron cargar los pedidos. Intenta más tarde.");
                setPedidos([]); 
                setMeta({ total: 0, page, lastPage: 1 });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user?.id, isAuth,page, limit,filter,search]);

    return { pedidos,meta,loading,error };
}
