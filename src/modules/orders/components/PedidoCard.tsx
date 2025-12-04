

import { Link } from 'react-router-dom';




export default function PedidoCard({ pedido }: { pedido: any }) {

    const totalArticulos = Array.isArray(pedido.imagenes)
    ? pedido.imagenes.reduce((acc:number, item: { imagen: string; cantidad?: number }) => acc + (item.cantidad ?? 1), 0)
    : 0;

    return (
        <div className="w-full max-w-[1200px]  mx-auto border border-gray-200 rounded-[5px] shadow-md shadow-[#00000033] bg-white overflow-hidden">
        

            {/* Estado del pedido */}
            <div className=" bg-[#F8F6F6]  px-4 py-2 rounded-t-md border-b border-[#CACACA] mb-3">
                <span className=" px-2 py-1 font-bold text-[#C9B35E]  bg-[#F6E8C2] rounded">
                    {pedido.estado}
                </span>
            </div>
            <div  className="px-4" >
                {/* Entrega estimada */}
                <div className="text-base font-medium text-gray-700 ">
                    <span>Entrega estimada:</span>{' '}
                    {new Date(pedido.fechaEntregaEstimada).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>

                <div className="flex justify-between items-center px-4 mt-4 mb-4">
                    {/* Imágenes de productos */}
                    <div className="flex space-x-5 px-4 ">
                        {Array.isArray(pedido.imagenes) &&
                        pedido.imagenes.map((img: any, i: number) =>
                            img?.imagen ? (
                            <div key={i} className="relative">
                                <img src={img.imagen} alt="Producto" className="w-20 h-20 object-cover rounded-lg bg-gray-100"/>
                                    {img.cantidad > 1 && (
                                <span className="absolute bottom-1 right-1 bg-[#C9B35E] text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                                    x{img.cantidad}
                                </span>
                                )}
                            </div>
                            ) : null
                        )}
                    </div>

                    <Link 
                        to={`/mis-pedidos/${pedido._id}`}
                        className="w-[160px] text-center text-sm font-medium px-4 py-2 rounded bg-[#C9B35E] hover:bg-[#EADCA4] hover:text-[#C9B35E] text-white transition-colors duration-400"
                    >
                        Ver detalle
                    </Link>
                </div>
            </div>

            {/* Franja  con datos genrales de la orden*/}
            <div className="px-4 py-3 text-sm text-gray-800 border-t border-[#CACACA] ">
                <div className="flex justify-end space-x-6">
                    <div>
                        <span className="font-medium text-[#766F5D]">{totalArticulos} Artículos:</span>{' '}
                        <span className="font-semibold text-gray-900">S/ {pedido.total.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="font-medium text-[#766F5D]">Fecha del Pedido:</span>{' '}
                        <span>
                        {new Date(pedido.fechaCreacion).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium text-[#766F5D]">ID Pedido:</span>{' '}
                        <span>{pedido.cod_orden}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}