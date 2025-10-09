import { usePedidos } from '../hooks/usePedidos';
import PedidoCard from '../components/PedidoCard';

export default function CustomerOrdersPage() {
    const { pedidos,loading } = usePedidos();

    return (
        <div className="p-6">
            <h1 className="text-[40px] text-[#4B493D] mx-[120px] font-bold mb-10">Mis pedidos</h1>
            {loading ? (
                <p>Cargando pedidos...</p>
            ) : (
                <div className="space-y-4">
                {pedidos.map((p: any) => (
                    <PedidoCard key={p.cod_orden} pedido={p} />
                ))}
                </div>
            )}
        </div>
    );
}