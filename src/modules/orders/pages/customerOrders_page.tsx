import { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import PedidoCard from '../components/PedidoCard';


export default function CustomerOrdersPage() {
    const [page, setPage] = useState(1);
    const { pedidos,meta,loading } = usePedidos(page);

    return (
        <div className="p-6">
            <h1 className="text-[40px] text-[#4B493D] mx-[120px] font-bold mb-10">Mis pedidos</h1>

            <div className="flex items-center gap-x-6 mx-[120px] text-[#4B493D] mb-10">
                <div className="relative w-[400px]">
                    <img
                        src="/icons/lupa.png" 
                        alt="Buscar"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Nombre artículo / ID pedido"
                        className="w-full pl-12 pr-4 py-2 border-2 border-[#766F5D] hover:border-[#C9B35E] rounded-full text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C9B35E]"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-[#4B493D]">
                        <img
                            src="/icons/filtros.png" 
                            alt="Filtro"
                            className="w-7 h-7"
                        />
                        <select className="font-semibold bg-transparent border-none focus:outline-none text-sm text-[#4B493D] hover:text-[#C9B35E]">
                            <option value="todos">Todos</option>
                            <option value="enviado">Este mes</option>
                            <option value="entregado">Mes pasado</option>
                            <option value="entregado">Este año</option>
                            <option value="entregado">2024</option>
                            <option value="entregado">2023</option>
                            <option value="entregado">2022</option>
                            <option value="entregado">2021</option>

                        </select>
                    </div>

                    <div className="h-5 w-px bg-gray-300" />

                    <span className="font-semibold text-sm text-gray-600">
                    {meta.total} Pedidos
                    </span>
                </div>
            </div>
            {loading ? (
                <p>Cargando pedidos...</p>
            ) : (
                <div className="space-y-4">
                {pedidos.map((p: any) => (
                    <PedidoCard key={p.cod_orden} pedido={p} />
                ))}
                </div>
            )}

            <div className="flex items-center  justify-center mt-8 space-x-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-white bg-[#C9B35E] rounded hover:bg-gray-300 transition-colors duration-400"
                >
                    Anterior
                </button>
                <span className="text-sm font-semibold text-[#4B493D]">Página {page}</span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, meta.lastPage))}
                    disabled={page === meta.lastPage}
                    className="px-4 py-2 text-white bg-[#C9B35E] rounded hover:bg-gray-300 transition-colors duration-400"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}