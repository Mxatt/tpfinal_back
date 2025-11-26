# Backend - Gestor de Inversiones Personales

### Configuración de Email (Importante para Render)

Tuve muchas complicaciones con render, bloqueaba todas mis peticiones salientes para verificar el mail, asi que decidi directamente usar vercel para evitarme los problemas

#### COMO CONFIGURAR EL MODO DE PRUEBA
EN RENDER PONER

- **Key**: `USE_TEST_EMAIL`
- **Value**: `true`



## Tecnologías Utilizadas

-   **MongoDB**
-   **Mongoose**
-   **JWT**
-   **Bcryptjs**
-   **Nodemailer**

## Documentación de la API

### Autenticación

#### Registrar Usuario
-   **URL**: `/api/auth/register`
-   **Método**: `POST`
-   **Cuerpo (JSON)**:
    ```json
    {
      "nombreUsuario": "usuario1",
      "email": "usuario@ejemplo.com",
      "contrasena": "password123"
    }
    ```
-   **Respuesta**: Mensaje de éxito y token  (si salio todo OK).

#### Iniciar Sesión
-   **URL**: `/api/auth/login`
-   **Método**: `POST`
-   **Cuerpo (JSON)**:
    ```json
    {
      "email": "usuario@ejemplo.com",
      "contrasena": "password123"
    }
    ```
-   **Respuesta**: Token JWT.

#### Verificar Email
-   **URL**: `/api/auth/verify/:token`
-   **Método**: `GET`
-   **Descripción**: (verifica la cuenta)

### Inversiones 

#### Obtener Todas las Inversiones
-   **URL**: `/api/investments`
-   **Método**: `GET`
-   **Descripción**: Devuelve la lista de inversiones activas del usuario autenticado.

#### Agregar Inversión
-   **URL**: `/api/investments`
-   **Método**: `POST`
-   **Cuerpo (JSON)**:
    ```json
    {
      "nombre": "Apple Inc.",
      "montoInicial": 1000,
      "porcentajeRetornoAnual": 5.5,
      "tiempoInversion": 12,
      "tipoInversion": "Acciones",
      "enlaceInversion": "(url de la inversion)"
    }
    ```


#### Eliminar Inversión
-   **URL**: `/api/investments/:id`
-   **Método**: `DELETE`
-   **Descripción**: Marca la inversión como eliminada .

#### Obtener Datos del Usuario
-   **URL**: `/api/investments/userdata`
-   **Método**: `GET`
-   **Descripción**: Devuelve el total invertido y otros datos agregados del usuario.

#### Obtener Historial
-   **URL**: `/api/investments/history`
-   **Método**: `GET`
-   **Descripción**: Devuelve el historial de transacciones (depósitos, retiros).

## para instalar

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/Mxatt/tpfinal_back.git
    cd tpfinal_back
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables (ajusta los valores según tu entorno):
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/midb
    JWT_SECRET=placeholdertoken
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=email.com
    EMAIL_PASS=placeholderpass
    EMAIL_FROM=placeholdersender
    API_URL=http://localhost:5000
    FRONTEND_URL=http://localhost:5173
    USE_TEST_EMAIL=true (false si lograra enviar emails con nodemailer)
    ```

4.  **Iniciar el Servidor**
    ```bash
    npm start
    ```
    El servidor correrá en `http://localhost:5000`.

## Despliegue

La API se encuentra desplegada en:
**tpfinal-back.vercel.app**

