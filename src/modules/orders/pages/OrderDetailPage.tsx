// src/modules/orders/pages/OrderDetailPage.tsx

import { useParams, Link } from 'react-router-dom';
import { usePedidoDetail } from '../hooks/usePedidoDetail';

interface DetalleProducto {
    nombre: string;
    marca: string;
    imagen: string;
}

interface OrderItemType {
    cantidad: number;
    precioUnitario: number;
    subTotal: number;
    detalle_producto: DetalleProducto;
}

// Componente para un item individual del pedido - AHORA CON ESTILO
function OrderItem({ item }: { item: any }) {
    return (
        // Se añade borde inferior y padding
        <div className="flex items-start gap-x-6 py-6 last:pb-0 first:pt-0 border-b border-gray-200 last:border-b-0">
            <img 
                src={item.detalle_producto?.imagen || '/placeholder.png'} 
                alt={item.detalle_producto?.nombre || 'Producto'} 
                className="w-24 h-24 object-cover rounded-lg bg-gray-100" 
            />
            <div className="flex-1">
                <p className="font-semibold text-lg text-gray-800">{item.detalle_producto?.nombre || 'Nombre no disponible'}</p>
                {/* CORRECCIÓN: Se muestra el precio unitario correcto */}
                <p className="text-sm text-gray-600 mb-1">S/{(item.precioUnitario || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-500 font-medium">{item.detalle_producto?.marca || 'Marca no disponible'}</p>
                 {/* AÑADIDO: Texto de devolución como en el mockup */}
                <p className="text-xs text-gray-500 mt-2">Devolución elegible hasta el 27 de Agosto de 2025</p>
            </div>
            <span className="text-gray-600">x {item.cantidad || 1}</span>
        </div>
    );
}

// NUEVO: Componente reutilizable para las tarjetas de información
function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        // Estilos de la tarjeta como en el mockup
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
    if (error) return <p className="text-center p-10 text-red-500">Error al cargar el pedido.</p>;
    if (!pedido) return <p className="text-center p-10 text-gray-600">Pedido no encontrado.</p>;

    const deliveryDate = new Date(pedido.fechaActualizacion);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    
    // Simulación de descuento para el resumen
    const subtotal = pedido.costos?.subtotal || 0;
    const total = pedido.costos?.total || 0;
    const descuento = total - subtotal - (pedido.costos?.envio || 0);

    return (
        // Se añade un fondo gris claro para la página
        <div className="p-6 bg-transparent min-h-screen">
            <div className="max-w-6xl mx-auto">
                <Link to="/mis-pedidos" className="text-[#C9B35E] hover:underline mb-6 inline-block">&larr; Volver a Mis Pedidos</Link>
                
                <h1 className="text-3xl font-bold text-[#4B493D]">Pedido {pedido.cod_orden}</h1>
                {/* MEJORA: Estilo del estado del pedido como en el mockup */}
                <div className="px-4 py-2 mt-2 mb-8 inline-block bg-[#F6E8C2] rounded">
                    <span className="text-lg font-bold text-[#C9B35E]">{pedido.estado}: {formattedDeliveryDate}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- CAMBIOS EN ESTA SECCIÓN --- */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* 1. SE AÑADE LA FRANJA GRIS PARA LA CABECERA */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-[#4B493D]">Artículos</h2>
                        </div>

                        {/* 2. EL CONTENIDO AHORA TIENE SU PROPIO DIV CON PADDING */}
                        <div className="px-6">
                            {pedido.items?.map((item: OrderItemType, index: number) => (
                                <OrderItem key={index} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* La columna de detalles ahora usa el componente InfoCard */}
                    <div className="space-y-6">
                        <InfoCard title="Envío" icon="/icons/camion.png">
                            <p className="font-semibold">{pedido.direccionEnvio?.nombreCompleto || 'N/A'}</p>
                            <p>{pedido.direccionEnvio?.direccionLinea1 || 'N/A'}</p>
                        </InfoCard>

                        {/* AÑADIDO: Tarjeta de método de pago */}
                        <InfoCard title="Método Pago" icon="/icons/tarjeta.png">
                            <p>{pedido.metodoPago || 'No especificado'}</p>
                            {/* Simulamos la fecha y referencia como en el mockup */}
                            <p>
                                {new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} | #1072894317
                            </p>
                        </InfoCard>
                        
                        {/* MEJORA: El resumen ahora es una tarjeta estilizada */}
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4">Detalle de la compra</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                               {/* CORRECCIÓN 2: Especificar tipos aquí también */}
                               {pedido.items?.map((item: OrderItemType, index: number) => (
                                   <div key={index} className="flex justify-between">
                                        <span>{item.detalle_producto?.nombre}</span>
                                        <span>S/{(item.subTotal || 0).toFixed(2)}</span>
                                   </div>
                               ))}
                               {descuento < 0 && (
                                   <div className="flex justify-between text-green-600">
                                       <span>Descuento</span>
                                       <span>-S/{Math.abs(descuento).toFixed(2)}</span>
                                   </div>
                               )}
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span>{pedido.costos?.envio === 0 ? 'Gratis' : `S/${pedido.costos?.envio.toFixed(2)}`}</span>
                                </div>
                                <hr className="my-2"/>
                                <div className="flex justify-between font-bold text-base text-gray-800">
                                    <span>Total</span>
                                    <span>S/{pedido.costos?.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Franja inferior - sin cambios mayores de estructura */}
                <div className="mt-8 px-4 py-3 text-sm text-gray-800 border-t border-gray-200 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-end space-x-6">
                        <div>
                            <span className="font-medium text-[#766F5D]">{pedido.items?.length || 0} Artículos:</span>{' '}
                            <span className="font-semibold text-gray-900">S/ {pedido.costos?.total.toFixed(2)}</span>
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