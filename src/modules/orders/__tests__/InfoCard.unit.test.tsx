import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InfoCard from '../components/InfoCard';

describe('InfoCard', () => {
    it('muestra el título, ícono y contenido correctamente', () => {
        render(
        <InfoCard title="Estado" icon="/icons/estado.png">
            <p>Pedido entregado</p>
        </InfoCard>
        );

        expect(screen.getByText('Estado')).toBeInTheDocument();
        expect(screen.getByAltText('Estado')).toHaveAttribute('src', '/icons/estado.png');
        expect(screen.getByText('Pedido entregado')).toBeInTheDocument();
    });

    it('renderiza correctamente aunque no tenga children', () => {
        render(<InfoCard title="Sin contenido" icon="/icons/vacio.png" />);
        expect(screen.getByText('Sin contenido')).toBeInTheDocument();
        // el contenedor de children existe pero está vacío
        const childrenContainer = screen.getByText('Sin contenido').closest('div')?.nextSibling;
        expect(childrenContainer?.textContent).toBe('');
    });

    it('muestra múltiples elementos children', () => {
        render(
            <InfoCard title="Detalles" icon="/icons/detalles.png">
                <p>Primero</p>
                <p>Segundo</p>
            </InfoCard>
        );
        expect(screen.getByText('Primero')).toBeInTheDocument();
        expect(screen.getByText('Segundo')).toBeInTheDocument();
    });
});
