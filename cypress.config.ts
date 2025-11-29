import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1440,
    viewportHeight: 1080,
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
  },
});