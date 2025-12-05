import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import * as useCartHook from '../../hooks/useCart'
import * as useStockValidationHook from '../../hooks/useStockValidation'
import CartPage from '../../page/cart_page'

// Mock de los hooks
vi.mock('../../hooks/useCart')
vi.mock('../../hooks/useStockValidation')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

vi.mock('../../components/orderSummary', () => ({
  default: ({ products, subtotal, total }: any) => (
    <div data-testid="order-summary">
      <div>Products: {products.length}</div>
      <div>Subtotal: {subtotal}</div>
      <div>Total: {total}</div>
    </div>
  )
}))

describe('CartPage - Test Funcional del Carrito', () => {
  const mockCart = {
    id: 7,
    items: [
      {
        idProducto: 1,
        idVariante: null,
        nombre: 'Producto Test 1',
        precio: 100.00,
        cantidad: 2,
        imagenUrl: '/test1.jpg'
      },
      {
        idProducto: 2,
        idVariante: 1,
        nombre: 'Producto Test 2',
        precio: 50.00,
        cantidad: 1,
        imagenUrl: '/test2.jpg'
      }
    ]
  }

  const mockUpdateQuantity = vi.fn()
  const mockRemoveFromCart = vi.fn()
  const mockGetProductStockStatus = vi.fn()
  const mockValidateCart = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup del mock de useCart
    vi.mocked(useCartHook.useCart).mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      fetchCart: vi.fn(),
      addToCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      clearCart: vi.fn()
    })

    // Setup del mock de useStockValidation
    mockGetProductStockStatus.mockImplementation((idProducto: number) => ({
      idProducto,
      stockDisponible: 10,
      tieneStock: true,
      excedeCantidad: false,
      cantidadMaxima: 10
    }))

    mockValidateCart.mockReturnValue({
      isValid: true,
      hasOutOfStock: false,
      hasExceeded: false
    })

    vi.mocked(useStockValidationHook.useStockValidation).mockReturnValue({
      stockInfo: new Map(),
      loading: false,
      error: null,
      fetchStock: vi.fn(),
      getProductStockStatus: mockGetProductStockStatus,
      validateCart: mockValidateCart
    })
  })

  it('debe renderizar el carrito con los productos correctamente', async () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    // Verificar título del carrito
    expect(screen.getByText(/TU CARRITO \(3 productos\)/i)).toBeInTheDocument()

    // Verificar que se muestran los productos
    expect(screen.getByText('Producto Test 1')).toBeInTheDocument()
    expect(screen.getByText('Producto Test 2')).toBeInTheDocument()

    // Verificar precios
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()

    // Verificar cantidades
    const quantities = screen.getAllByText(/^[0-9]+$/)
    expect(quantities).toHaveLength(2)

    // Verificar que el OrderSummary se renderiza
    expect(screen.getByTestId('order-summary')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $250.00')).toBeInTheDocument()
    expect(screen.getByText('Total: $250.00')).toBeInTheDocument()
  })

  it('debe incrementar la cantidad de un producto', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    // Encontrar el primer producto y su botón de incremento
    const incrementButtons = screen.getAllByText('+')
    await user.click(incrementButtons[0])

    // Verificar que se llamó a updateQuantity con los parámetros correctos
    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3, null)
    })
  })

  it('debe decrementar la cantidad de un producto', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    // Encontrar el botón de decremento del primer producto
    const decrementButtons = screen.getAllByText('-')
    await user.click(decrementButtons[0])

    // Verificar que se llamó a updateQuantity
    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1, null)
    })
  })

  it('debe eliminar un producto del carrito', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    // Encontrar el botón de eliminar (emoji 🗑️)
    const deleteButtons = screen.getAllByTitle('Eliminar producto')
    await user.click(deleteButtons[0])

    // Verificar que se llamó a removeFromCart
    await waitFor(() => {
      expect(mockRemoveFromCart).toHaveBeenCalledWith(1, null)
    })

    // Verificar que aparece el toast de éxito
    await waitFor(() => {
      expect(screen.getByText('Producto eliminado')).toBeInTheDocument()
    })
  })

  it('debe deshabilitar el botón + cuando se alcanza el stock máximo', () => {
    // Simular stock limitado: producto 1 tiene cantidad 2 y máximo es 2
    mockGetProductStockStatus.mockImplementation((idProducto: number, cantidadSolicitada: number) => {
      if (idProducto === 1) {
        return {
          idProducto,
          stockDisponible: 2,
          tieneStock: true,
          excedeCantidad: cantidadSolicitada > 2,
          cantidadMaxima: 2
        }
      }
      return {
        idProducto,
        stockDisponible: 10,
        tieneStock: true,
        excedeCantidad: false,
        cantidadMaxima: 10
      }
    })

    vi.mocked(useStockValidationHook.useStockValidation).mockReturnValue({
      stockInfo: new Map(),
      loading: false,
      error: null,
      fetchStock: vi.fn(),
      getProductStockStatus: mockGetProductStockStatus,
      validateCart: mockValidateCart
    })

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    const incrementButtons = screen.getAllByText('+')
    expect(incrementButtons[0]).toBeDisabled()

    expect(incrementButtons[1]).not.toBeDisabled()
  })

  it('debe deshabilitar el botón de continuar cuando el carrito es inválido', () => {
    mockValidateCart.mockReturnValue({
      isValid: false,
      hasOutOfStock: true,
      hasExceeded: false
    })

    vi.mocked(useStockValidationHook.useStockValidation).mockReturnValue({
      stockInfo: new Map(),
      loading: false,
      error: null,
      fetchStock: vi.fn(),
      getProductStockStatus: mockGetProductStockStatus,
      validateCart: mockValidateCart
    })

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    const continueButton = screen.getByRole('button', { name: /Continuar Compra/i })
    expect(continueButton).toBeDisabled()

    expect(screen.getByText(/Problemas con el stock/i)).toBeInTheDocument()
    expect(screen.getByText(/Algunos productos ya no tienen stock disponible/i)).toBeInTheDocument()
  })

  it('debe mostrar mensaje cuando el carrito está vacío', () => {
    vi.mocked(useCartHook.useCart).mockReturnValue({
      cart: { id: 7, items: [] },
      loading: false,
      error: null,
      fetchCart: vi.fn(),
      addToCart: vi.fn(),
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn()
    })

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
    const continueButton = screen.getByRole('button', { name: /Continuar Compra/i })
    expect(continueButton).toBeDisabled()
  })

  it('debe mostrar estado de carga inicial', () => {
    vi.mocked(useCartHook.useCart).mockReturnValue({
      cart: null,
      loading: true,
      error: null,
      fetchCart: vi.fn(),
      addToCart: vi.fn(),
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      clearCart: vi.fn()
    })

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    )

    expect(screen.getByText(/Cargando carrito/i)).toBeInTheDocument()
  })
})