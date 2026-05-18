# Sistema de Gestión de Tareas

API RESTful con interfaz web para gestión de tareas en un equipo de desarrollo, construida con Node.js, Express y MongoDB.

## Instalación

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Configura la base de datos en `config/database.js` o usa un archivo `.env` con `MONGO_URI`
4. Ejecuta el servidor: `npm start` o `npm run dev` para desarrollo

> Si el puerto 3000 está ocupado, el servidor intentará iniciar automáticamente en el siguiente puerto libre hasta 3010.

## Acceso

- **API:** `http://localhost:3000/api/` (o el puerto libre que indique la consola)
- **Interfaz Web:** `http://localhost:3000/` (o el puerto libre que indique la consola)

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con los valores:

```env
MONGO_URI='mongodb://localhost:27017/taskmanagement'
PORT=3000
NODE_ENV=development
```

## Ejecución

- `npm start` - Ejecuta el servidor con Node.
- `npm run dev` - Ejecuta el servidor con `nodemon` y recarga automática.

## Interfaz Web

Abre `http://localhost:3000/` en tu navegador.

- En la sección `Usuarios` puedes crear, editar y eliminar usuarios.
- En la sección `Tareas` puedes crear tareas, asignarlas a un usuario, editarlas y eliminarlas.
- En la sección `Proyectos` puedes crear proyectos y asociarles tareas existentes.
- Usa `Editar` para cargar un registro en el formulario.
- Usa `Eliminar` para borrar un registro.
- Usa `Cancelar` para salir del modo edición sin guardar cambios.

## Endpoints

### Usuarios
- POST /api/usuarios - Crear usuario
- GET /api/usuarios - Listar usuarios
- GET /api/usuarios/:id - Obtener usuario
- PUT /api/usuarios/:id - Actualizar usuario
- DELETE /api/usuarios/:id - Eliminar usuario

### Tareas
- POST /api/tareas - Crear tarea
- GET /api/tareas - Listar tareas
- GET /api/tareas/:id - Obtener tarea
- PUT /api/tareas/:id - Actualizar tarea
- DELETE /api/tareas/:id - Eliminar tarea

### Proyectos
- POST /api/proyectos - Crear proyecto
- GET /api/proyectos - Listar proyectos
- GET /api/proyectos/:id - Obtener proyecto
- PUT /api/proyectos/:id - Actualizar proyecto
- DELETE /api/proyectos/:id - Eliminar proyecto

## Modelos

- **Usuario**: nombre, email, contraseña
- **Tarea**: título, descripción, estado, fechaCreación, fechaLímite, asignadoA
- **Proyecto**: nombre, descripcion, tareas