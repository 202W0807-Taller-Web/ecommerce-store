import CustomerOrdersPage from '../pages/customerOrders_page';
// --- AÑADIR ESTA IMPORTACIÓN ---
import OrderDetailPage from '../pages/OrderDetailPage'; // Crearemos este archivo a continuación

export const ordersRoutes = [
    {
        path: '/mis-pedidos',
        element: <CustomerOrdersPage />,
    },
    // --- AÑADIR ESTA NUEVA RUTA ---
    {
        path: '/mis-pedidos/:orderId',
        element: <OrderDetailPage />,
    },
];
