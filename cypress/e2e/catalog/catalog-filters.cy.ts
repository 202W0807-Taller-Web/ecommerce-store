describe('Catálogo de Productos - Filtros y Paginación', () => {
  beforeEach(() => {
    // Visitar la página del catálogo antes de cada prueba
    cy.visit('/catalog');
    
    // Esperar a que carguen los productos
    cy.get('[data-testid^="product-card-"]', { timeout: 10000 }).should('exist');
  });

  describe('Visualización de Productos', () => {
    it('debe mostrar productos inicialmente', () => {
      cy.get('[data-testid^="product-card-"]').should('have.length.greaterThan', 0);
    });

    it('debe mostrar información básica de cada producto', () => {
      cy.get('[data-testid^="product-card-"]').first().within(() => {
        // Verificar que tiene imagen, nombre y precio
        cy.get('img').should('exist');
        cy.get('h3').should('exist');
        cy.contains(/S\//i).should('exist'); // Precio en soles
      });
    });
  });

  describe('Filtros de Precio', () => {
    it('debe filtrar productos por rango de precio', () => {
      cy.viewport(1280, 720);
      
      // Establecer precio mínimo
      cy.get('[data-testid="price-min-input"]').clear().type('100');
      
      // Establecer precio máximo
      cy.get('[data-testid="price-max-input"]').clear().type('500');
      
      // Aplicar filtros
      cy.get('[data-testid="apply-filters-btn"]').click();
      
      // Esperar a que se actualicen los resultados
      cy.wait(1000);
      
      // Verificar que la URL tiene los parámetros correctos
      cy.url().should('include', 'priceMin=100');
      cy.url().should('include', 'priceMax=500');
      
      // Verificar que hay productos o mensaje de sin resultados
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid^="product-card-"]').length > 0) {
          cy.get('[data-testid^="product-card-"]').should('exist');
        } else {
          cy.contains('No se encontraron productos').should('exist');
        }
      });
    });

    it('debe validar que precio mínimo no sea mayor que máximo', () => {
      cy.viewport(1280, 720);
      
      // Intentar poner precio mínimo mayor que máximo
      cy.get('[data-testid="price-min-input"]').clear().type('500');
      cy.get('[data-testid="price-max-input"]').clear().type('100');
      
      // Aplicar filtros
      cy.get('[data-testid="apply-filters-btn"]').click();
      
      // Verificar que hay un mensaje de error
      cy.contains(/precio mínimo|mayor/i).should('exist');
    });

    it('debe permitir solo precio mínimo', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="price-min-input"]').clear().type('100');
      cy.get('[data-testid="apply-filters-btn"]').click();
      
      cy.wait(1000);
      
      cy.url().should('include', 'priceMin=100');
    });

    it('debe permitir solo precio máximo', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="price-max-input"]').clear().type('500');
      cy.get('[data-testid="apply-filters-btn"]').click();
      
      cy.wait(1000);
      
      cy.url().should('include', 'priceMax=500');
    });
  });

  describe('Filtros de Categoría', () => {
    it('debe filtrar productos por categoría (Ropa)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'category=');
    });

    it('debe filtrar productos por categoría (Calzado)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Calzado')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'category=');
    });

    it('debe filtrar productos por categoría (Accesorios)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Accesorios')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'category=');
    });

    it('debe filtrar por múltiples categorías', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Calzado')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'category=');
    });
  });

  describe('Filtros de Género', () => {
    it('debe filtrar productos por género (Hombre)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Género"]')
        .parent()
        .contains('Hombre')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });

    it('debe filtrar productos por género (Mujer)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Género"]')
        .parent()
        .contains('Mujer')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });

    it('debe filtrar productos por género (Niños)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Género"]')
        .parent()
        .contains('Niños')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });
  });

  describe('Filtros de Deporte', () => {
    it('debe filtrar productos por deporte (Futbol)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Deporte"]')
        .parent()
        .contains('Futbol')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });

    it('debe filtrar productos por deporte (Básquet)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Deporte"]')
        .parent()
        .contains('Básquet')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });

    it('debe filtrar productos por deporte (Correr)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Deporte"]')
        .parent()
        .contains('Correr')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });
  });

  describe('Filtros de Tipo', () => {
    it('debe filtrar productos por tipo (Zapatilla)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Tipo"]')
        .parent()
        .contains('Zapatilla')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });

    it('debe filtrar productos por tipo (Polos)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Tipo"]')
        .parent()
        .contains('Polos')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });

    it('debe filtrar productos por tipo (Shorts)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Tipo"]')
        .parent()
        .contains('Shorts')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'tags=');
    });
  });

  describe('Filtros de Talla', () => {
    it('debe filtrar productos por talla (M)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Talla"]')
        .parent()
        .contains('M')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'size=');
    });

    it('debe filtrar productos por talla (L)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Talla"]')
        .parent()
        .contains('L')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'size=');
    });

    it('debe filtrar por múltiples tallas', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Talla"]')
        .parent()
        .contains('M')
        .click();
      
      cy.get('[data-testid="filter-checkbox-Talla"]')
        .parent()
        .contains('L')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'size=');
    });
  });

  describe('Filtros de Color', () => {
    it('debe filtrar productos por color (Negro)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Color"]')
        .parent()
        .contains('Negro')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'color=');
    });

    it('debe filtrar productos por color (Blanco)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Color"]')
        .parent()
        .contains('Blanco')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'color=');
    });

    it('debe filtrar productos por color (Azul)', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Color"]')
        .parent()
        .contains('Azul')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'color=');
    });

    it('debe filtrar por múltiples colores', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="filter-checkbox-Color"]')
        .parent()
        .contains('Negro')
        .click();
      
      cy.get('[data-testid="filter-checkbox-Color"]')
        .parent()
        .contains('Blanco')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'color=');
    });
  });

  describe('Filtros Combinados', () => {
    it('debe combinar filtros de precio y categoría', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="price-min-input"]').clear().type('50');
      cy.get('[data-testid="price-max-input"]').clear().type('300');
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'priceMin=50');
      cy.url().should('include', 'priceMax=300');
      cy.url().should('include', 'category=');
    });

    it('debe combinar múltiples filtros', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="price-min-input"]').clear().type('50');
      cy.get('[data-testid="price-max-input"]').clear().type('300');
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="filter-checkbox-Género"]')
        .parent()
        .contains('Hombre')
        .click();
      
      cy.get('[data-testid="filter-checkbox-Color"]')
        .parent()
        .contains('Negro')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'priceMin=50');
      cy.url().should('include', 'priceMax=300');
      cy.url().should('include', 'category=');
      cy.url().should('include', 'tags=');
      cy.url().should('include', 'color=');
    });
  });

  describe('Limpiar Filtros', () => {
    it('debe limpiar todos los filtros', () => {
      cy.viewport(1280, 720);
      
      // Aplicar algunos filtros
      cy.get('[data-testid="price-min-input"]').clear().type('100');
      
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      // Limpiar filtros
      cy.get('[data-testid="clear-filters-btn"]').click();
      
      // Verificar que los campos están vacíos
      cy.get('[data-testid="price-min-input"]').should('have.value', '');
      cy.get('[data-testid="price-max-input"]').should('have.value', '');
      
      // Verificar que los checkboxes están desmarcados
      cy.get('[data-testid="filter-checkbox-Categoría"]').should('not.be.checked');
    });

    it('debe restaurar todos los productos al limpiar filtros', () => {
      cy.viewport(1280, 720);
      
      // Aplicar filtro restrictivo
      cy.get('[data-testid="price-min-input"]').clear().type('10000');
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      // Limpiar filtros
      cy.get('[data-testid="clear-filters-btn"]').click();
      cy.wait(1000);
      
      // Verificar que hay productos nuevamente
      cy.get('[data-testid^="product-card-"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Ordenamiento', () => {
    it('debe ordenar productos por precio ascendente', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="sort-select"]').select('price asc');
      cy.wait(1000);
      
      cy.get('[data-testid^="product-card-"]').should('exist');
      cy.url().should('include', 'sortBy=price asc');
    });

    it('debe ordenar productos por precio descendente', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="sort-select"]').select('price desc');
      cy.wait(1000);
      
      cy.get('[data-testid^="product-card-"]').should('exist');
      cy.url().should('include', 'sortBy=price desc');
    });

    it('debe mantener filtros al cambiar ordenamiento', () => {
      cy.viewport(1280, 720);
      
      // Aplicar filtro
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      // Cambiar ordenamiento
      cy.get('[data-testid="sort-select"]').select('price asc');
      cy.wait(1000);
      
      // Verificar que el filtro se mantiene
      cy.url().should('include', 'category=');
      cy.url().should('include', 'sortBy=price asc');
    });
  });

  describe('Paginación', () => {
    it('debe mostrar información de paginación', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="pagination-info"]').should('exist');
    });

    it('debe navegar a la siguiente página si existe', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="next-page-btn"]').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(1000);
          
          cy.url().should('include', 'page=2');
          cy.get('[data-testid^="product-card-"]').should('exist');
        }
      });
    });

    it('debe navegar a la página anterior desde página 2', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="next-page-btn"]').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(1000);
          
          cy.get('[data-testid="prev-page-btn"]').click();
          cy.wait(1000);
          
          cy.url().should('include', 'page=1');
        }
      });
    });

    it('debe deshabilitar botón anterior en página 1', () => {
      cy.viewport(1280, 720);
      
      cy.get('[data-testid="prev-page-btn"]').should('be.disabled');
    });

    it('debe navegar a una página específica', () => {
      cy.viewport(1280, 720);
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="page-btn-3"]').length > 0) {
          cy.get('[data-testid="page-btn-3"]').click();
          cy.wait(1000);
          cy.url().should('include', 'page=3');
        }
      });
    });

    it('debe mantener filtros al cambiar de página', () => {
      cy.viewport(1280, 720);
      
      // Aplicar filtro
      cy.get('[data-testid="filter-checkbox-Categoría"]')
        .parent()
        .contains('Ropa')
        .click();
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      // Cambiar de página
      cy.get('[data-testid="next-page-btn"]').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(1000);
          
          // Verificar que el filtro se mantiene
          cy.url().should('include', 'category=');
          cy.url().should('include', 'page=2');
        }
      });
    });
  });

});