type Order = {
  id: string;
  date: string;
  status: "Pendiente" | "En proceso" | "Enviado" | "Entregado" | "Cancelado";
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
};

type OrderHistoryProps = {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
};

export const OrderHistory = ({
  orders,
  onViewDetails,
  onTrackOrder,
}: OrderHistoryProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay pedidos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Aún no has realizado ningún pedido. Cuando lo hagas, aparecerán
            aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Historial de pedidos
        </h2>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Fecha: {order.date}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                    order.status === "Entregado"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Enviado"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Cancelado"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center py-2">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x S/ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{order.items.length - 2} más
                  </p>
                )}
              </div>

              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm font-medium">
                  Total:{" "}
                  <span className="text-gray-900">
                    S/ {order.total.toFixed(2)}
                  </span>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(order.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Detalles
                  </button>
                  {order.status === "Enviado" && (
                    <>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Rastrear
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <div className="relative">
          <div className="overflow-x-auto max-w-full">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pedido
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {order.id}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "producto"
                              : "productos"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "Entregado"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Enviado"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Cancelado"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          S/ {order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => onViewDetails(order.id)}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer text-sm font-medium"
                            >
                              Ver detalle
                            </button>
                            {order.status === "Enviado" && (
                              <button
                                onClick={() => onTrackOrder(order.id)}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer text-sm font-medium"
                              >
                                Rastrear
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
