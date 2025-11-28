

export default function OrderItem({ item, entrega }: { item: any, entrega: any }) {

    const tiempoEstimadoDias =
        entrega?.tipo === "RECOJO_TIENDA"
            ? entrega?.tiempoEstimadoDias
            : entrega?.carrierSeleccionado?.tiempo_estimado_dias;

    // Construir el mensaje
    const mensajeEntrega =
        tiempoEstimadoDias !== undefined && tiempoEstimadoDias !== null
            ? `Llegada estimada en un plazo de ${tiempoEstimadoDias} días`
            : "Tiempo estimado no disponible";


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
                
                <p className="text-sm text-gray-600 mb-1">S/{(item.precioUnitario || 0).toFixed(2)}</p>
                {/* <p className="text-sm text-gray-500 font-medium">{item.detalle_producto?.marca || 'Marca no disponible'}</p> */}
                <p className="text-sm text-gray-500 font-medium">{item.detalle_producto?.descripcion || 'Descripción no disponible'}</p>
                <p className="text-xs text-gray-500 mt-2">{mensajeEntrega}</p>
            </div>
            <span className="text-gray-600">x {item.cantidad || 1}</span>
        </div>
    );
}