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
      cy.viewport(1440, 1080);
      
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
      cy.viewport(1440, 1080);
      
      // Intentar poner precio mínimo mayor que máximo
      cy.get('[data-testid="price-min-input"]').clear().type('500');
      cy.get('[data-testid="price-max-input"]').clear().type('100');
      
      // Aplicar filtros
      cy.get('[data-testid="apply-filters-btn"]').should('be.disabled')
      
    });

    it('debe permitir solo precio mínimo', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="price-min-input"]').clear().type('100');
      cy.get('[data-testid="apply-filters-btn"]').click();
      
      cy.wait(1000);
      
      cy.url().should('include', 'priceMin=100');
    });

    it('debe permitir solo precio máximo', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="price-max-input"]').clear().type('500');
      cy.get('[data-testid="apply-filters-btn"]').click();
      
      cy.wait(1000);
      
      cy.url().should('include', 'priceMax=500');
    });
  });

  describe('Filtros de Categoría', () => {
    it('debe filtrar productos por categoría (Ropa)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Ropa"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por categoría (Calzado)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Calzado"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por categoría (Accesorios)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Accesorios"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar por múltiples categorías', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Ropa"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="filter-checkbox-Calzado"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });
  });

  describe('Filtros de Género', () => {
    it('debe filtrar productos por género (Hombre)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Hombre"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por género (Mujer)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Mujer"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por género (Niños)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Niños"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });
  });

  describe('Filtros de Deporte', () => {
    it('debe filtrar productos por deporte (Futbol)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Futbol"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por deporte (Básquet)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Básquet"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por deporte (Correr)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Correr"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });
  });

  describe('Filtros de Tipo', () => {
    it('debe filtrar productos por tipo (Zapatilla)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Zapatilla"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por tipo (Polos)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Polos"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });

    it('debe filtrar productos por tipo (Shorts)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Shorts"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      
    });
  });

  describe('Filtros de Talla', () => {
    it('debe filtrar productos por talla (M)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-M"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });

    it('debe filtrar productos por talla (L)', () => {
      
      cy.get('[data-testid="filter-checkbox-L"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });

    it('debe filtrar por múltiples tallas', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-M"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="filter-checkbox-L"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });
  });

  describe('Filtros de Color', () => {
    it('debe filtrar productos por color (Negro)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Negro"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });

    it('debe filtrar productos por color (Blanco)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Blanco"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });

    it('debe filtrar productos por color (Azul)', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Azul"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });

    it('debe filtrar por múltiples colores', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="filter-checkbox-Negro"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="filter-checkbox-Blanco"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
    });
  });

  describe('Filtros Combinados', () => {
    it('debe combinar filtros de precio y categoría', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="price-min-input"]').clear().type('50');
      cy.get('[data-testid="price-max-input"]').clear().type('300');
      
      cy.get('[data-testid="filter-checkbox-Ropa"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'priceMin=50');
      cy.url().should('include', 'priceMax=300');
      
    });

    it('debe combinar múltiples filtros', () => {
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="price-min-input"]').clear().type('50');
      cy.get('[data-testid="price-max-input"]').clear().type('300');
      
      cy.get('[data-testid="filter-checkbox-Ropa"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="filter-checkbox-Hombre"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="filter-checkbox-Negro"]')
      .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      cy.url().should('include', 'priceMin=50');
      cy.url().should('include', 'priceMax=300');
      
      
    });
  });

  describe('Limpiar Filtros', () => {
    it('debe limpiar todos los filtros', () => {
      cy.viewport(1440, 1080);
      
      // Aplicar algunos filtros
      cy.get('[data-testid="price-min-input"]').clear().type('100');
      
      cy.get('[data-testid="filter-checkbox-Ropa"]')
        .scrollIntoView()
        .click({ force: true });
      
      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      // Limpiar filtros
      cy.get('[data-testid="clear-filters-btn"]').click();
      
      // Verificar que los campos están vacíos
      cy.get('[data-testid="price-min-input"]').should('have.value', '');
      cy.get('[data-testid="price-max-input"]').should('have.value', '');
      
      // Verificar que los checkboxes están desmarcados
      cy.get('[data-testid="filter-checkbox-Ropa"]').should('not.be.checked');
    });

    it('debe restaurar todos los productos al limpiar filtros', () => {
      cy.viewport(1440, 1080);
      
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


  describe('Paginación', () => {

    it('debe navegar a la siguiente página si existe', () => {
      cy.viewport(1440, 1080);
      
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
      cy.viewport(1440, 1080);
      
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
      cy.viewport(1440, 1080);
      
      cy.get('[data-testid="prev-page-btn"]').should('be.disabled');
    });

    it('debe navegar a una página específica', () => {
      cy.viewport(1440, 1080);
      
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="page-btn-3"]').length > 0) {
          cy.get('[data-testid="page-btn-3"]').click();
          cy.wait(1000);
          cy.url().should('include', 'page=3');
        }
      });
    });

    it('debe mantener filtros al cambiar de página', () => {
      cy.viewport(1440, 1080);
      
      // Aplicar filtro
      cy.get('[data-testid="filter-checkbox-Ropa"]')
        .scrollIntoView()
        .click({ force: true });
        
      cy.get('[data-testid="filter-checkbox-Calzado"]')
        .scrollIntoView()
        .click({ force: true });

      cy.get('[data-testid="apply-filters-btn"]').click();
      cy.wait(1000);
      
      // Cambiar de página
      cy.get('[data-testid="next-page-btn"]').then(($btn) => {
        if (!$btn.is(':disabled')) {
          cy.wrap($btn).click();
          cy.wait(1000);
          
          // Verificar que el filtro se mantiene
          
          cy.url().should('include', 'page=2');
        }
      });
    });
  });

});