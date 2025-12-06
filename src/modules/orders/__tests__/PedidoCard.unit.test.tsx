import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PedidoCard from '../components/PedidoCard';

const basePedido = {
    _id: 'abc123',
    estado: 'Enviado',
    fechaEntregaEstimada: '2025-12-10T00:00:00Z',
    fechaCreacion: '2025-12-01T00:00:00Z',
    cod_orden: 'ORD-001',
    total: 250.5,
    imagenes: [
        { imagen: '/img/producto1.png', cantidad: 2 },
        { imagen: '/img/producto2.png', cantidad: 1 },
    ],
    };

    describe('PedidoCard', () => {
    it('muestra correctamente los datos del pedido', () => {
        render(
        <MemoryRouter>
            <PedidoCard pedido={basePedido} />
        </MemoryRouter>
        );

        expect(screen.getByText('Enviado')).toBeInTheDocument();
        expect(screen.getByText('Entrega estimada:')).toBeInTheDocument();
        expect(screen.getByText('Ver detalle')).toBeInTheDocument();
        expect(screen.getByText('3 Artículos:')).toBeInTheDocument();
        expect(screen.getByText('S/ 250.50')).toBeInTheDocument();
        expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    it('muestra 0 artículos si no hay imágenes', () => {
        const pedidoSinImagenes = { ...basePedido, imagenes: [] };
        render(
        <MemoryRouter>
            <PedidoCard pedido={pedidoSinImagenes} />
        </MemoryRouter>
        );
        expect(screen.getByText('0 Artículos:')).toBeInTheDocument();
    });

    it('asume cantidad = 1 si no está definida', () => {
        const pedidoCantidadDefault = {
        ...basePedido,
        imagenes: [{ imagen: '/img/producto1.png' }],
        };
        render(
        <MemoryRouter>
            <PedidoCard pedido={pedidoCantidadDefault} />
        </MemoryRouter>
        );
        expect(screen.getByText('1 Artículos:')).toBeInTheDocument();
    });

    it('no renderiza imagen si el campo imagen es null', () => {
        const pedidoImagenNull = {
        ...basePedido,
        imagenes: [{ imagen: null, cantidad: 2 }],
        };
        render(
        <MemoryRouter>
            <PedidoCard pedido={pedidoImagenNull} />
        </MemoryRouter>
        );
        // No debería aparecer ninguna imagen con alt="Producto"
        expect(screen.queryByAltText('Producto')).not.toBeInTheDocument();
    });

    it('muestra badge de cantidad solo si cantidad > 1', () => {
        render(
        <MemoryRouter>
            <PedidoCard pedido={basePedido} />
        </MemoryRouter>
        );
        expect(screen.getByText('x2')).toBeInTheDocument();
        // El segundo producto tiene cantidad 1, no debería mostrar badge
        expect(screen.queryByText('x1')).not.toBeInTheDocument();
    });

    it('renderiza el link de detalle correctamente', () => {
        render(
        <MemoryRouter>
            <PedidoCard pedido={basePedido} />
        </MemoryRouter>
        );
        const link = screen.getByText('Ver detalle');
        expect(link).toHaveAttribute('href', '/mis-pedidos/abc123');
    });
});
