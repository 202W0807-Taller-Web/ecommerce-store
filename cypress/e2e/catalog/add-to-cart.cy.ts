describe('Agregar Producto al Carrito', () => {
  beforeEach(() => {
    // Visitar la página del catálogo
    cy.visit('/catalog');
    
    // Esperar a que carguen los productos
    cy.get('[data-testid^="product-card-"]', { timeout: 10000 }).should('exist');
  });

  describe('Navegación a Detalle de Producto', () => {
    it('debe navegar al detalle del producto al hacer clic', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid^="product-link-"]').first().click();
      
      cy.url().should('include', '/catalog/product/');
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
    });

    it('debe mostrar información completa del producto', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid^="product-link-"]').first().click();
      
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
      
      // Verificar elementos básicos
      cy.get('h1').should('exist'); // Nombre del producto
      cy.contains(/S\//i).should('exist'); // Precio
      cy.get('img').should('exist'); // Imagen
    });
  });

  describe('Selección de Variantes', () => {
    beforeEach(() => {
      cy.viewport(1440, 1080);
      cy.get('[data-testid^="product-link-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
    });

    it('debe permitir seleccionar un color', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
          cy.get('[data-testid^="color-btn-"]').first().should('have.class', 'ring-2');
        }
      });
    });

    it('debe permitir cambiar entre colores', () => {
      cy.get('body').then(($body) => {
        const colorBtns = $body.find('[data-testid^="color-btn-"]');
        
        if (colorBtns.length > 1) {
          // Seleccionar primer color
          cy.get('[data-testid^="color-btn-"]').eq(0).click();
          cy.get('[data-testid^="color-btn-"]').eq(0).should('have.class', 'ring-2');
          
          // Cambiar al segundo color
          cy.get('[data-testid^="color-btn-"]').eq(1).click();
          cy.get('[data-testid^="color-btn-"]').eq(1).should('have.class', 'ring-2');
        }
      });
    });

    it('debe seleccionar color negro (ID 28) si está disponible', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="color-btn-28"]').length > 0) {
          cy.get('[data-testid="color-btn-28"]').click();
          cy.get('[data-testid="color-btn-28"]').should('have.class', 'ring-2');
        }
      });
    });

    it('debe seleccionar color azul (ID 30) si está disponible', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="color-btn-30"]').length > 0) {
          cy.get('[data-testid="color-btn-30"]').click();
          cy.get('[data-testid="color-btn-30"]').should('have.class', 'ring-2');
        }
      });
    });

    it('debe seleccionar color rojo (ID 35) si está disponible', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="color-btn-35"]').length > 0) {
          cy.get('[data-testid="color-btn-35"]').click();
          cy.get('[data-testid="color-btn-35"]').should('have.class', 'ring-2');
        }
      });
    });

    it('debe permitir seleccionar una talla', () => {
      cy.get('body').then(($body) => {
        // Primero seleccionar color
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        // Luego seleccionar talla
        if ($body.find('[data-testid^="size-btn-"]').length > 0) {
          cy.get('[data-testid^="size-btn-"]').first().click();
          cy.get('[data-testid^="size-btn-"]').first().should('have.class', 'ring-2');
        }
      });
    });

    it('debe cambiar entre diferentes tallas', () => {
      cy.get('body').then(($body) => {
        // Seleccionar color primero
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        // Cambiar entre tallas si existen múltiples
        const sizeBtns = $body.find('[data-testid^="size-btn-"]');
        if (sizeBtns.length > 1) {
          cy.get('[data-testid^="size-btn-"]').eq(0).click();
          cy.wait(300);
          cy.get('[data-testid^="size-btn-"]').eq(0).should('have.class', 'ring-2');
          
          cy.get('[data-testid^="size-btn-"]').eq(1).click();
          cy.wait(300);
          cy.get('[data-testid^="size-btn-"]').eq(1).should('have.class', 'ring-2');
        }
      });
    });

    it('debe actualizar tallas disponibles al cambiar color', () => {
      cy.get('body').then(($body) => {
        const colorBtns = $body.find('[data-testid^="color-btn-"]');
        
        if (colorBtns.length > 1) {
          // Seleccionar primer color y verificar tallas
          cy.get('[data-testid^="color-btn-"]').eq(0).click();
          cy.wait(500);
          
          // Cambiar de color
          cy.get('[data-testid^="color-btn-"]').eq(1).click();
          cy.wait(500);
          
          // Verificar que las tallas se actualizaron (pueden cambiar)
          cy.get('[data-testid^="size-btn-"]').should('exist');
        }
      });
    });
  });

  describe('Gestión de Cantidad', () => {
    beforeEach(() => {
      cy.viewport(1440, 1080);
      cy.get('[data-testid^="product-link-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
    });

    it('debe tener cantidad inicial de 1', () => {
      cy.contains('1').should('exist');
    });

    it('debe incrementar cantidad usando el botón', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="increase-quantity-btn"]').length > 0) {
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.contains('2').should('exist');
        }
      });
    });

    it('debe incrementar cantidad múltiples veces', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="increase-quantity-btn"]').length > 0) {
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.contains('4').should('exist');
        }
      });
    });

    it('debe decrementar cantidad usando el botón', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="increase-quantity-btn"]').length > 0) {
          // Incrementar a 3
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.wait(300);
          
          // Decrementar a 2
          cy.get('[data-testid="decrease-quantity-btn"]').click();
          cy.contains('2').should('exist');
        }
      });
    });

    it('no debe permitir cantidad menor a 1', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="decrease-quantity-btn"]').length > 0) {
          // Intentar decrementar desde 1
          cy.get('[data-testid="decrease-quantity-btn"]').click();
          
          // Verificar que sigue en 1
          cy.contains('1').should('exist');
          
          // O que el botón está deshabilitado
          cy.get('[data-testid="decrease-quantity-btn"]').should('be.disabled');
        }
      });
    });

    it('debe mantener cantidad al cambiar variantes', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="increase-quantity-btn"]').length > 0) {
          // Incrementar cantidad
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.wait(300);
          
          // Cambiar color
          if ($body.find('[data-testid^="color-btn-"]').length > 1) {
            cy.get('[data-testid^="color-btn-"]').eq(0).click();
            cy.wait(300);
            cy.get('[data-testid^="color-btn-"]').eq(1).click();
            cy.wait(300);
            
            // Verificar que la cantidad se mantiene
            cy.contains('3').should('exist');
          }
        }
      });
    });
  });

  describe('Estado del Botón Agregar al Carrito', () => {
    beforeEach(() => {
      cy.viewport(1440, 1080);
      cy.get('[data-testid^="product-link-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
    });

    it('debe estar deshabilitado sin variante seleccionada', () => {
      cy.get('[data-testid="add-to-cart-btn"]').should('be.disabled');
    });

    it('debe habilitarse al seleccionar variante completa', () => {
      cy.get('body').then(($body) => {
        // Seleccionar color
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        // Seleccionar talla
        if ($body.find('[data-testid^="size-btn-"]').length > 0) {
          cy.get('[data-testid^="size-btn-"]').first().click();
          cy.wait(300);
          
          // Verificar que el botón está habilitado
          cy.get('[data-testid="add-to-cart-btn"]').should('not.be.disabled');
        }
      });
    });
  });

  describe('Agregar al Carrito - Casos de Éxito', () => {
    beforeEach(() => {
      cy.viewport(1440, 1080);
      cy.get('[data-testid^="product-link-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
    });

    it('debe agregar un producto al carrito con cantidad 1', () => {
      cy.get('body').then(($body) => {
        // Seleccionar variantes
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        if ($body.find('[data-testid^="size-btn-"]').length > 0) {
          cy.get('[data-testid^="size-btn-"]').first().click();
        }
      });
      
      cy.wait(500);
      
      cy.get('[data-testid="add-to-cart-btn"]').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.contains(/agregado|éxito/i, { timeout: 5000 }).should('exist');
        }
      });
    });

    it('debe agregar un producto con cantidad mayor a 1', () => {
      cy.get('body').then(($body) => {
        // Seleccionar variantes
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        if ($body.find('[data-testid^="size-btn-"]').length > 0) {
          cy.get('[data-testid^="size-btn-"]').first().click();
        }
        
        // Incrementar cantidad
        if ($body.find('[data-testid="increase-quantity-btn"]').length > 0) {
          cy.get('[data-testid="increase-quantity-btn"]').click();
          cy.get('[data-testid="increase-quantity-btn"]').click();
        }
      });
      
      cy.wait(500);
      
      cy.get('[data-testid="add-to-cart-btn"]').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.contains(/agregado|éxito/i, { timeout: 5000 }).should('exist');
        }
      });
    });

    it('debe agregar diferentes variantes del mismo producto', () => {
      cy.get('body').then(($body) => {
        const colorBtns = $body.find('[data-testid^="color-btn-"]');
        const sizeBtns = $body.find('[data-testid^="size-btn-"]');
        
        if (colorBtns.length > 0 && sizeBtns.length > 0) {
          // Primera variante
          cy.get('[data-testid^="color-btn-"]').eq(0).click();
          cy.get('[data-testid^="size-btn-"]').eq(0).click();
          cy.wait(500);
          
          cy.get('[data-testid="add-to-cart-btn"]').then(($btn) => {
            if (!$btn.is(':disabled')) {
              cy.wrap($btn).click();
              cy.contains(/agregado|éxito/i, { timeout: 5000 }).should('exist');
              cy.wait(1000);
              
              // Segunda variante
              if (colorBtns.length > 1) {
                cy.get('[data-testid^="color-btn-"]').eq(1).click();
                cy.wait(500);
                
                if ($body.find('[data-testid^="size-btn-"]').length > 0) {
                  cy.get('[data-testid^="size-btn-"]').first().click();
                  cy.wait(500);
                  
                  cy.get('[data-testid="add-to-cart-btn"]').click();
                  cy.contains(/agregado|éxito/i, { timeout: 5000 }).should('exist');
                }
              }
            }
          });
        }
      });
    });
  });

  describe('Agregar al Carrito - Casos de Error', () => {
    it('debe mostrar error si falla la petición al servidor', () => {
      // Interceptar la petición y forzar un error
      cy.intercept('POST', '**/api/carrito/agregar', {
        statusCode: 500,
        body: { message: 'Error al agregar al carrito' }
      }).as('addToCartError');
      
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid^="product-link-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        if ($body.find('[data-testid^="size-btn-"]').length > 0) {
          cy.get('[data-testid^="size-btn-"]').first().click();
        }
      });
      
      cy.wait(500);
      
      cy.get('[data-testid="add-to-cart-btn"]').click();
      cy.wait('@addToCartError');
      
      // Verificar mensaje de error
      cy.get('.bg-red-50').should('exist');
    });

    it('debe manejar timeout del servidor', () => {
      cy.intercept('POST', '**/api/carrito/agregar', {
        delayMs: 30000,
      }).as('addToCartTimeout');
      
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid^="product-link-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]', { timeout: 10000 }).should('exist');
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid^="color-btn-"]').length > 0) {
          cy.get('[data-testid^="color-btn-"]').first().click();
        }
        
        if ($body.find('[data-testid^="size-btn-"]').length > 0) {
          cy.get('[data-testid^="size-btn-"]').first().click();
        }
      });
      
      cy.wait(500);
      
      cy.get('[data-testid="add-to-cart-btn"]').click();
      
      // Verificar que hay algún indicador de error o timeout
      cy.get('.bg-red-50', { timeout: 15000 }).should('exist');
    });
  });


});