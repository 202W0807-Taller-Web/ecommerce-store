import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import * as useShippingUserHook from '../../hooks/useShippingUser'
import Checkout_Step2 from '../../page/checkoutPage_step2'

// Mock de los hooks y componentes
vi.mock('../../hooks/useShippingUser')

vi.mock('../../components/checkoutSteps', () => ({
  default: ({ currentStep }: any) => (
    <div data-testid="checkout-steps">Step {currentStep}</div>
  )
}))

vi.mock('../../components/orderSummary', () => ({
  default: ({ products, subtotal, shipping, total }: any) => (
    <div data-testid="order-summary">
      <div>Products: {products.length}</div>
      <div>Subtotal: {subtotal}</div>
      <div>Shipping: {shipping}</div>
      <div>Total: {total}</div>
    </div>
  )
}))

vi.mock('../../components/infoUserForm', () => ({
  default: ({ values, onChange }: any) => (
    <div data-testid="user-info-form">
      <input
        data-testid="input-nombres"
        placeholder="Nombres"
        value={values.nombreCompleto.split(' ')[0] || ''}
        onChange={(e) => {
          const apellidos = values.nombreCompleto.split(' ').slice(1).join(' ')
          onChange({
            ...values,
            nombreCompleto: `${e.target.value} ${apellidos}`.trim()
          })
        }}
      />
      <input
        data-testid="input-apellidos"
        placeholder="Apellidos"
        value={values.nombreCompleto.split(' ').slice(1).join(' ') || ''}
        onChange={(e) => {
          const nombres = values.nombreCompleto.split(' ')[0]
          onChange({
            ...values,
            nombreCompleto: `${nombres || ''} ${e.target.value}`.trim()
          })
        }}
      />
      <input
        data-testid="input-email"
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={(e) => onChange({ ...values, email: e.target.value })}
      />
      <input
        data-testid="input-telefono"
        type="tel"
        placeholder="Teléfono"
        value={values.telefono}
        onChange={(e) => onChange({ ...values, telefono: e.target.value })}
      />
    </div>
  )
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Checkout Step 2 - Información de Contacto', () => {
  const mockCreateUser = vi.fn()
  
  const defaultCartState = {
    passedCart: [
      {
        idProducto: 1,
        nombre: 'Producto Test 1',
        precio: 100.00,
        cantidad: 2
      },
      {
        idProducto: 2,
        nombre: 'Producto Test 2',
        precio: 50.00,
        cantidad: 1
      }
    ],
    method: 'standard'
  }

  const renderWithRouter = (state = defaultCartState) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/checkout/step2', state }]}>
        <Routes>
          <Route path="/checkout/step2" element={<Checkout_Step2 />} />
        </Routes>
      </MemoryRouter>
    )
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup del mock de useShippingUser - usuario no existe inicialmente
    vi.mocked(useShippingUserHook.useShippingUser).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      fetchUser: vi.fn(),
      createUser: mockCreateUser
    })
  })

  it('debe renderizar el formulario de contacto correctamente', () => {
    renderWithRouter()

    // Verificar que se muestra el paso correcto
    expect(screen.getByTestId('checkout-steps')).toHaveTextContent('Step 2')

    // Verificar título
    expect(screen.getByText('Información de contacto')).toBeInTheDocument()

    // Verificar que se renderiza el formulario
    expect(screen.getByTestId('user-info-form')).toBeInTheDocument()

    // Verificar campos del formulario
    expect(screen.getByTestId('input-nombres')).toBeInTheDocument()
    expect(screen.getByTestId('input-apellidos')).toBeInTheDocument()
    expect(screen.getByTestId('input-email')).toBeInTheDocument()
    expect(screen.getByTestId('input-telefono')).toBeInTheDocument()
  })

  it('debe calcular correctamente el resumen de la orden', () => {
    renderWithRouter()

    // Verificar OrderSummary
    expect(screen.getByTestId('order-summary')).toBeInTheDocument()
    expect(screen.getByText('Products: 2')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $250.00')).toBeInTheDocument()
    expect(screen.getByText('Shipping: $9.99')).toBeInTheDocument() // standard shipping
    expect(screen.getByText('Total: $259.99')).toBeInTheDocument()
  })

  it('debe deshabilitar el botón continuar cuando el formulario está incompleto', () => {
    renderWithRouter()

    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    
    // El botón debe estar deshabilitado inicialmente
    expect(continueButton).toBeDisabled()
    expect(continueButton).toHaveClass('cursor-not-allowed')
  })

  it('debe habilitar el botón continuar cuando todos los campos están completos', async () => {
    const user = userEvent.setup()
    
    renderWithRouter()

    // Llenar todos los campos
    await user.type(screen.getByTestId('input-nombres'), 'Juan')
    await user.type(screen.getByTestId('input-apellidos'), 'Pérez')
    await user.type(screen.getByTestId('input-email'), 'juan@example.com')
    await user.type(screen.getByTestId('input-telefono'), '999888777')

    // El botón debe estar habilitado
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled()
    })
  })

  it('debe mostrar error cuando se intenta continuar con campos vacíos', async () => {
    const user = userEvent.setup()
    
    renderWithRouter()

    // Llenar solo algunos campos
    await user.type(screen.getByTestId('input-nombres'), 'Juan')
    await user.type(screen.getByTestId('input-email'), 'juan@example.com')
    // Dejar teléfono vacío

    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    
    // El botón debe estar deshabilitado porque falta el teléfono
    expect(continueButton).toBeDisabled()
  })

  it('debe crear un nuevo usuario cuando no existe y continuar al siguiente paso', async () => {
    const user = userEvent.setup()
    
    mockCreateUser.mockResolvedValue({
      id: 1,
      idUsuario: 20,
      nombreCompleto: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '999888777'
    })

    renderWithRouter()

    // Llenar el formulario
    await user.type(screen.getByTestId('input-nombres'), 'Juan')
    await user.type(screen.getByTestId('input-apellidos'), 'Pérez')
    await user.type(screen.getByTestId('input-email'), 'juan@example.com')
    await user.type(screen.getByTestId('input-telefono'), '999888777')

    // Click en continuar
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    await user.click(continueButton)

    // Verificar que se llamó a createUser
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        idUsuario: 20,
        nombreCompleto: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '999888777'
      })
    })

    // Verificar navegación al siguiente paso
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/checkout/step3', {
        state: {
          passedCart: expect.any(Array),
          shippingMethod: 'standard',
          userInfo: {
            nombreCompleto: 'Juan Pérez',
            email: 'juan@example.com',
            telefono: '999888777'
          }
        }
      })
    })
  })

  it('debe pre-llenar el formulario si el usuario ya existe', () => {
    // Simular que el usuario ya existe
    vi.mocked(useShippingUserHook.useShippingUser).mockReturnValue({
      user: {
        id: 1,
        idUsuario: 20,
        nombreCompleto: 'María García',
        email: 'maria@example.com',
        telefono: '987654321'
      },
      loading: false,
      error: null,
      fetchUser: vi.fn(),
      createUser: mockCreateUser
    })

    renderWithRouter()

    // Verificar que los campos están pre-llenados
    expect(screen.getByTestId('input-nombres')).toHaveValue('María')
    expect(screen.getByTestId('input-apellidos')).toHaveValue('García')
    expect(screen.getByTestId('input-email')).toHaveValue('maria@example.com')
    expect(screen.getByTestId('input-telefono')).toHaveValue('987654321')
  })

  it('debe navegar de vuelta al step 1 cuando se hace click en volver', async () => {
    const user = userEvent.setup()
    
    renderWithRouter()

    const backButton = screen.getByRole('button', { name: /Volver a método de entrega/i })
    await user.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/checkout/step1', {
      state: { cart: expect.any(Array) }
    })
  })

  it('debe mostrar mensaje de error cuando falla la creación del usuario', async () => {
    const user = userEvent.setup()
    
    mockCreateUser.mockRejectedValue(new Error('Error de red'))

    renderWithRouter()

    // Llenar el formulario
    await user.type(screen.getByTestId('input-nombres'), 'Juan')
    await user.type(screen.getByTestId('input-apellidos'), 'Pérez')
    await user.type(screen.getByTestId('input-email'), 'juan@example.com')
    await user.type(screen.getByTestId('input-telefono'), '999888777')

    // Intentar continuar
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    await user.click(continueButton)

    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Ocurrió un error al guardar la información/i)).toBeInTheDocument()
    })
  })

  it('debe calcular el costo de envío correcto según el método seleccionado', () => {
    // Test con envío express
    const expressState = {
      passedCart: [
        { idProducto: 1, nombre: 'Producto 1', precio: 100, cantidad: 1 }
      ],
      method: 'express'
    }

    renderWithRouter(expressState)

    // Con express debería ser $19.99
    expect(screen.getByText('Shipping: $19.99')).toBeInTheDocument()
    expect(screen.getByText('Total: $119.99')).toBeInTheDocument()
  })

  it('debe mostrar mensaje apropiado cuando no hay carrito', () => {
    // Renderizar sin state (carrito vacío)
    render(
      <MemoryRouter initialEntries={[{ pathname: '/checkout/step2' }]}>
        <Routes>
          <Route path="/checkout/step2" element={<Checkout_Step2 />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/No hay carrito disponible/i)).toBeInTheDocument()
    expect(screen.getByText(/Volver/i)).toBeInTheDocument()
  })

  it('debe mostrar el botón en estado de carga durante el envío', async () => {
    const user = userEvent.setup()

    // Simular un createUser que tarda
    mockCreateUser.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ id: 1 }), 100))
    )

    renderWithRouter()

    // Llenar formulario
    await user.type(screen.getByTestId('input-nombres'), 'Juan')
    await user.type(screen.getByTestId('input-apellidos'), 'Pérez')
    await user.type(screen.getByTestId('input-email'), 'juan@example.com')
    await user.type(screen.getByTestId('input-telefono'), '999888777')

    // Click en continuar
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    await user.click(continueButton)

    // Verificar estado de carga
    expect(screen.getByText(/Procesando.../i)).toBeInTheDocument()
  })
})