# E-commerce

## Como correr el proyecto

Bastante simple, solo utiliza los siguientes comandos:

- npm install (para instalar todas las dependencias necesarias)
- npm run dev (para correr el proyecto)

Si tienes algun problema con las dependencias, puede que sea porque estas en Windows, para ello, recomiendo utilizar `pnpm run dev`, lo cual debería arreglar cualquier problema :)

## Como colaborar en el proyecto

Dependiendo del modulo que te toque, trabajaras en la carpeta con el nombre de tu módulo, por ejemplo, si tu modulo es el catálogo, te dirijes a `src/catalog` y desarrollas tu feature ahí. No olvides realizar estos pasos antes de empezar a programar:

- Jala todos los cambios realizados en la rama `dev` con un `git pull origin dev`
- Crea una rama asignándole un nombre con la siguiente forma `modulo-feature-developer_name`

Para subir tus cambios crea una PR hacia `dev` y mandaselo al coordinador de tu módulo, el cual se encargará de realizar el merge correspondiente y arreglar conflictos si es necesario.

## Manejo de ramas

La rama de producción sera `main`, la cual será gestionada por el equipo 3 y solo aceptará PRs desde dev.

La rama de desarrollo será `dev`, donde será gestionada por todos los coordinadores de los diferentes módulos que tenemos, aceptará PRs de cualquier tipo.

Por último, las diferentes ramas que se creen a partir de `dev` solo pueden ser gestionadas por una persona a menos que esta busque ayuda voluntariamente.
