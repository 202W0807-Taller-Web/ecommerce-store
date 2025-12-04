import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderItem from '../components/OrderItem';

const baseItem = {
    detalle_producto: {
        nombre: 'Zapatos deportivos',
        imagen: '/img/zapatos.png',
        descripcion: 'Para correr y entrenar',
    },
    precioUnitario: 120,
    cantidad: 2,
};

describe('OrderItem', () => {
    it('renderiza correctamente los datos del producto y mensaje de entrega DOMICILIO', () => {
        const entrega = { tipo: 'DOMICILIO', carrierSeleccionado: { tiempo_estimado_dias: 3 } };
        render(<OrderItem item={baseItem} entrega={entrega} />);

        expect(screen.getByText('Zapatos deportivos')).toBeInTheDocument();
        expect(screen.getByText('S/120.00')).toBeInTheDocument();
        expect(screen.getByText('Para correr y entrenar')).toBeInTheDocument();
        expect(screen.getByText('Llegada estimada en un plazo de 3 días')).toBeInTheDocument();
        expect(screen.getByText('x 2')).toBeInTheDocument();
    });

    it('muestra mensaje de entrega para RECOJO_TIENDA', () => {
        const entrega = { tipo: 'RECOJO_TIENDA', tiempoEstimadoDias: 5 };
        render(<OrderItem item={baseItem} entrega={entrega} />);
        expect(screen.getByText('Llegada estimada en un plazo de 5 días')).toBeInTheDocument();
    });

    it('muestra mensaje de tiempo no disponible si no hay datos', () => {
        const entrega = { tipo: 'DOMICILIO', carrierSeleccionado: {} };
        render(<OrderItem item={baseItem} entrega={entrega} />);
        expect(screen.getByText('Tiempo estimado no disponible')).toBeInTheDocument();
    });

    it('usa imagen placeholder si no hay imagen', () => {
        const itemSinImagen = { ...baseItem, detalle_producto: { ...baseItem.detalle_producto, imagen: undefined } };
        render(<OrderItem item={itemSinImagen} entrega={{}} />);
        expect(screen.getByAltText('Zapatos deportivos')).toHaveAttribute('src', '/placeholder.png');
    });

    it('muestra valores por defecto si faltan nombre, descripción, precio y cantidad', () => {
        const itemIncompleto = { detalle_producto: {}, precioUnitario: undefined, cantidad: undefined };
        render(<OrderItem item={itemIncompleto} entrega={{}} />);
        expect(screen.getByText('Nombre no disponible')).toBeInTheDocument();
        expect(screen.getByText('Descripción no disponible')).toBeInTheDocument();
        expect(screen.getByText('S/0.00')).toBeInTheDocument();
        expect(screen.getByText('x 1')).toBeInTheDocument();
    });
});
