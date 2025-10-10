import { useParams, Link } from 'react-router-dom';
import { usePedidoDetail } from '../hooks/usePedidoDetail';

// Componente para un item individual del pedido
function OrderItem({ item }: { item: any }) {
    return (
        <div className="flex items-start gap-x-6 pb-6 last:pb-0 last:border-b-0 border-b border-gray-200">
            <img src={item.imagen} alt={item.nombre} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
            <div className="flex-1">
                <p className="font-semibold text-lg text-gray-800">{item.nombre}</p>
                <p className="text-sm text-gray-500 mb-1">S/{item.precio.toFixed(2)}</p>
                <p className="text-sm text-gray-600 font-medium">{item.marca}</p>
                <p className="text-xs text-gray-500 mt-2">
                    Devolución elegible hasta el {new Date(item.devolucionEligibleHasta).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
            <span className="text-gray-500">x 1</span>
        </div>
    );
}

// Componente para las tarjetas de información (Envío, Pago)
function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-x-3 mb-3">
                <img src={icon} alt={title} className="w-6 h-6" />
                <h3 className="font-bold text-gray-700">{title}</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
                {children}
            </div>
        </div>
    );
}


export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const { pedido, loading, error } = usePedidoDetail(orderId);

    if (loading) return <p className="text-center p-10 text-gray-600">Cargando detalles del pedido...</p>;
    if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
    if (!pedido) return <p className="text-center p-10 text-gray-600">Pedido no encontrado.</p>;

    const deliveryDate = new Date(pedido.fechaActualizacion);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <Link to="/mis-pedidos" className="text-[#C9B35E] hover:underline mb-6 inline-block">&larr; Volver a Mis Pedidos</Link>
                
                <h1 className="text-3xl font-bold text-[#4B493D]">Pedido {pedido.cod_orden}</h1>
                <div className="px-4 py-2 mt-2 mb-8 inline-block bg-[#F6E8C2] rounded">
                    <span className="text-lg font-bold text-[#C9B35E]">{pedido.estado}: {formattedDeliveryDate}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna de Artículos */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold text-[#4B493D] mb-6">Artículos</h2>
                        <div className="space-y-6">
                            {pedido.articulosDetallados.map((item: any) => (
                                <OrderItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Columna de Detalles */}
                    <div className="space-y-6">
                        <InfoCard title="Envío" icon="/icons/camion.png">
                            <p className="font-semibold">{pedido.envio.nombre}</p>
                            <p>{pedido.envio.direccion}</p>
                        </InfoCard>

                        <InfoCard title="Método Pago" icon="/icons/tarjeta.png">
                            <p>{pedido.pago.metodo}</p>
                            <p>
                                {new Date(pedido.pago.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} | {pedido.pago.referencia}
                            </p>
                        </InfoCard>

                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4">Detalle de la compra</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Maillot para hombre</span>
                                    <span>S/100.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Casco negro</span>
                                    <span>S/80.00</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span>Guantes cortos</span>
                                    <span>S/80.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Descuento</span>
                                    <span className="text-green-600">-S/{Math.abs(pedido.resumenCompra.descuento).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span>{pedido.resumenCompra.envio === 0 ? 'Gratis' : `S/${pedido.resumenCompra.envio.toFixed(2)}`}</span>
                                </div>
                                <hr className="my-2"/>
                                <div className="flex justify-between font-bold text-base text-gray-800">
                                    <span>Total</span>
                                    <span>S/{pedido.resumenCompra.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Franja con datos generales de la orden*/}
                <div className="mt-8 px-4 py-3 text-sm text-gray-800 border-t border-[#CACACA] bg-white rounded-lg shadow-sm">
                    <div className="flex justify-end space-x-6">
                        <div>
                            <span className="font-medium text-[#766F5D]">{pedido.articulosDetallados.length} Artículos:</span>{' '}
                            <span className="font-semibold text-gray-900">S/ {pedido.total.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="font-medium text-[#766F5D]">Fecha del Pedido:</span>{' '}
                            <span>
                                {new Date(pedido.fechaCreacion).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-[#766F5D]">ID Pedido:</span>{' '}
                            <span>{pedido.cod_orden}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}