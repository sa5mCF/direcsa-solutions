# 🏗️ Direcsa Solutions

Plataforma web de **Direcsa** — catálogo de productos, sistema de cotizaciones y panel de administración. Construida con **Next.js 15**, **Prisma ORM**, **PostgreSQL** y almacenamiento de imágenes en **AWS S3**.

---

## 📑 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Diagrama de Arquitectura](#-diagrama-de-arquitectura)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Variables de Entorno](#-variables-de-entorno)
- [Makefile](#-makefile)
- [Inicio Rápido](#-inicio-rápido)
- [Stack Tecnológico](#-stack-tecnológico)
- [Licencia](#-licencia)

---

## 🏛️ Arquitectura

El proyecto sigue una **arquitectura modular por features** donde la lógica de negocio se organiza por dominio dentro de `src/modules/`. Cada módulo contiene su propio **controller** (manejo de request/response) y **service** (lógica de negocio y acceso a datos via Prisma).

### Principios Clave

| Principio | Descripción |
|-----------|-------------|
| **Modular por Feature** | Cada dominio (auth, product, quote, etc.) es un módulo independiente |
| **Prisma como fuente de tipos** | Se usan los tipos generados por Prisma directamente, sin mappers redundantes |
| **Controller → Service** | Los controllers delegan toda la lógica al service correspondiente |
| **Middleware JWT** | Rutas protegidas verificadas mediante middleware de Next.js con tokens JWT |
| **API Routes de Next.js** | La API REST se define dentro de `app/api/` usando App Router |

### Flujo de una Petición

```
Cliente (Browser)
    │
    ▼
┌─────────────────────┐
│   Next.js Middleware │ ◄── Verifica JWT en rutas protegidas
│   (middleware.ts)    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   API Route Handler  │ ◄── app/api/{resource}/route.ts
│   (App Router)       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│     Controller       │ ◄── src/modules/{feature}/{feature}.controller.ts
│  (Request/Response)  │     Valida input, maneja respuestas HTTP
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│      Service         │ ◄── src/modules/{feature}/{feature}.service.ts
│  (Lógica de Negocio) │     Operaciones CRUD via Prisma Client
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   PostgreSQL (DB)    │
│   + AWS S3 (Assets)  │
└─────────────────────┘
```

---

## 🗺️ Diagrama de Arquitectura

### Vista General del Sistema

```mermaid
graph TB
    subgraph Cliente["🖥️ Cliente (Browser)"]
        Pages["Páginas Next.js<br/>SSR + CSR"]
        Components["Componentes React"]
    end

    subgraph NextJS["⚡ Next.js 15 (App Router)"]
        MW["Middleware JWT"]
        API["API Routes<br/>/api/*"]
        SSR["Server-Side Rendering"]
    end

    subgraph Modules["📦 Módulos de Negocio (src/modules)"]
        Auth["🔐 Auth"]
        Admin["👤 Admin"]
        Product["📦 Product"]
        Brand["🏷️ Brand"]
        Category["📂 Category"]
        Quote["📋 Quote"]
        Contact["✉️ Contact"]
    end

    subgraph Data["💾 Datos"]
        Prisma["Prisma ORM"]
        PG["PostgreSQL"]
        S3["AWS S3<br/>(Imágenes)"]
    end

    Pages --> MW
    MW --> API
    API --> Auth
    API --> Admin
    API --> Product
    API --> Brand
    API --> Category
    API --> Quote
    API --> Contact

    Auth --> Prisma
    Admin --> Prisma
    Product --> Prisma
    Brand --> Prisma
    Category --> Prisma
    Quote --> Prisma
    Contact --> Prisma

    Product --> S3
    Brand --> S3
    Prisma --> PG
```

### Estructura de Módulos

```mermaid
graph LR
    subgraph Module["Estructura de cada Módulo"]
        Controller["controller.ts<br/>─────────────<br/>• Parsea request<br/>• Valida datos<br/>• Retorna response"]
        Service["service.ts<br/>─────────────<br/>• Lógica de negocio<br/>• Queries Prisma<br/>• Reglas de dominio"]
        Types["types.ts<br/>─────────────<br/>• Tipos del módulo<br/>• (Opcional)"]
        Comps["components/<br/>─────────────<br/>• UI del módulo<br/>• (Opcional)"]
    end

    Controller --> Service
    Controller --> Types
    Comps --> Controller
```

### Modelo de Base de Datos

```mermaid
erDiagram
    User ||--o| BuyerProfile : "tiene"
    User ||--o{ UserPermission : "posee"
    User ||--o{ Quote : "crea"
    LuPermission ||--o{ UserPermission : "asignado a"
    Quote ||--o{ QuoteItem : "contiene"
    Product ||--o{ QuoteItem : "referenciado en"
    Brand ||--o{ Product : "agrupa"
    Category ||--o{ Product : "clasifica"
    Category ||--o| Category : "padre/hijo"

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        UserType userType
        boolean isActive
    }

    Product {
        string id PK
        string name
        string sku UK
        string unit
        decimal priceMxn
        decimal priceUsd
        string brandId FK
        string categoryId FK
    }

    Quote {
        string id PK
        QuoteStatus status
        decimal total
        string userId FK
    }

    Brand {
        string id PK
        string name
        string logoOriginal
    }

    Category {
        string id PK
        string name
        string parentId FK
    }

    ContactMessage {
        string id PK
        string name
        string email
        string description
        boolean isRead
    }
```

---

## 📂 Estructura de Carpetas

```
direcsa/
├── app/                          # App Router de Next.js (páginas + API)
│   ├── api/                      # Rutas API REST
│   │   ├── admin/                #   └── Gestión de administradores
│   │   ├── auth/                 #   └── Login / Register
│   │   ├── brands/               #   └── CRUD de marcas
│   │   ├── categories/           #   └── CRUD de categorías
│   │   ├── contacto/             #   └── Formulario de contacto
│   │   ├── products/             #   └── CRUD de productos
│   │   ├── quotes/               #   └── Sistema de cotizaciones
│   │   └── uploads/              #   └── Subida de imágenes a S3
│   │
│   ├── catalogo/                 # Página pública del catálogo
│   ├── contacto/                 # Página de contacto
│   ├── control-center/           # Panel de administración (protegido)
│   ├── dashboard/                # Dashboard del usuario (protegido)
│   ├── login/                    # Página de inicio de sesión
│   ├── register/                 # Página de registro
│   ├── products/                 # Vista pública de productos
│   ├── proyectos/                # Página de proyectos
│   ├── soluciones/               # Página de soluciones
│   ├── components/               # Componentes compartidos de las páginas
│   ├── layout.tsx                # Layout raíz de la aplicación
│   ├── page.tsx                  # Página principal (landing)
│   └── globals.css               # Estilos globales
│
├── src/                          # Código fuente del backend
│   ├── modules/                  # Módulos de negocio (feature-based)
│   │   ├── admin/                #   └── Gestión de administradores
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── components/       #       └── UI del centro de control
│   │   ├── auth/                 #   └── Autenticación (login/register)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts
│   │   │   └── components/       #       └── Formularios de auth
│   │   ├── brand/                #   └── Marcas de productos
│   │   │   ├── brand.controller.ts
│   │   │   └── brand.service.ts
│   │   ├── category/             #   └── Categorías de productos
│   │   │   ├── category.controller.ts
│   │   │   └── category.service.ts
│   │   ├── contact/              #   └── Mensajes de contacto
│   │   │   ├── contact.controller.ts
│   │   │   └── contact.service.ts
│   │   ├── product/              #   └── Productos del catálogo
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   └── components/       #       └── UI de productos
│   │   └── quote/                #   └── Cotizaciones
│   │       ├── quote.controller.ts
│   │       └── quote.service.ts
│   │
│   └── lib/                      # Utilidades compartidas
│       ├── auth/                 #   └── JWT y hashing de passwords
│       │   ├── jwt.ts
│       │   └── password.ts
│       ├── prisma.ts             #   └── Cliente singleton de Prisma
│       ├── s3.ts                 #   └── Cliente de AWS S3
│       └── uploadImage.ts        #   └── Utilidad de subida de imágenes
│
├── prisma/                       # Esquema y migraciones de BD
│   ├── schema.prisma             #   └── Definición del esquema
│   ├── migrations/               #   └── Historial de migraciones
│   └── seed-permissions.ts       #   └── Seed de permisos iniciales
│
├── deploy/                       # Configuración de despliegue
│   └── db/
│       ├── Dockerfile            #   └── Imagen Docker de PostgreSQL
│       └── init.sql              #   └── Script de inicialización de BD
│
├── scripts/                      # Scripts de utilidad
│   ├── list-users.ts             #   └── Listar usuarios de la BD
│   └── test-upload.ts            #   └── Prueba de subida a S3
│
├── public/                       # Assets estáticos
│   └── images/                   #   └── Imágenes del sitio
│
├── middleware.ts                  # Middleware de autenticación JWT
├── docker-compose.yml            # Orquestación de servicios (PostgreSQL)
├── Makefile                      # Comandos de automatización
├── package.json                  # Dependencias y scripts NPM
├── tsconfig.json                 # Configuración de TypeScript
├── vercel.json                   # Configuración de despliegue en Vercel
└── .env                          # Variables de entorno (no commitear)
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

### Base de Datos (PostgreSQL)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `POSTGRES_USER` | Usuario de PostgreSQL | `root` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `password` |
| `POSTGRES_HOST` | Host del servidor de BD | `localhost` |
| `POSTGRES_PORT` | Puerto de PostgreSQL | `5432` |
| `POSTGRES_DB` | Nombre de la base de datos | `direcsa` |
| `DATABASE_URL` | URL de conexión completa (usada por Prisma) | `postgresql://root:password@localhost:5432/direcsa` |

### Autenticación

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `mi-clave-super-secreta` |

### Servicios Externos

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONTACT_FORM_URL` | URL del endpoint de contacto (pública) | `https://example.com/api/contact` |
| `AWS_S3_BUCKET` | Nombre del bucket de S3 | `direcsa-assets` |
| `AWS_REGION` | Región de AWS | `mx-central-1` |
| `AWS_ACCESS_KEY_ID` | Access Key de AWS IAM | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de AWS IAM | `uHP5...` |

> [!CAUTION]
> **Nunca subas el archivo `.env` al repositorio.** Asegúrate de que está incluido en `.gitignore`. Las credenciales de AWS y el `JWT_SECRET` deben ser diferentes en producción.

---

## ⚙️ Makefile

El proyecto incluye un `Makefile` para automatizar tareas comunes de desarrollo. Los comandos leen automáticamente las variables del archivo `.env`.

| Comando | Descripción |
|---------|-------------|
| `make run-local` | 🚀 Inicia el entorno completo de desarrollo: genera el SQL de init, levanta PostgreSQL con Docker y arranca Next.js |
| `make stop-dev` | 🛑 Detiene los contenedores de Docker Compose |
| `make db-push` | 📤 Sincroniza el esquema de Prisma con la BD (sin crear migración) |
| `make db-migrate` | 📦 Ejecuta migraciones de Prisma dentro del contenedor |
| `make db-file` | 📄 Genera un archivo SQL a partir del esquema de Prisma (`deploy/db/init.sql`) |
| `make db-generate` | ⚡ Regenera el cliente de Prisma (`prisma generate`) |

### Uso Típico

```bash
# Primera vez — levantar todo el entorno
make run-local

# Después de modificar el schema de Prisma
make db-push
make db-generate

# Detener los servicios
make stop-dev
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 18
- **Docker** y **Docker Compose**
- **npm**

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd direcsa

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales correspondientes

# 4. Levantar todo el entorno
make run-local
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🧰 Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| [Next.js 15](https://nextjs.org/) | Framework fullstack (App Router) |
| [React 19](https://react.dev/) | Librería de UI |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Prisma ORM](https://www.prisma.io/) | ORM y migraciones de BD |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos relacional |
| [AWS S3](https://aws.amazon.com/s3/) | Almacenamiento de imágenes |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos utilitarios |
| [Framer Motion](https://www.framer.com/motion/) | Animaciones |
| [Zod](https://zod.dev/) | Validación de esquemas |
| [Jose](https://github.com/panva/jose) | Manejo de JWT |
| [Swagger UI](https://swagger.io/tools/swagger-ui/) | Documentación interactiva de la API |
| [Docker](https://www.docker.com/) | Contenedorización |
| [Vercel](https://vercel.com/) | Despliegue en producción |

---

## 📖 Documentación de la API (Swagger)

La API cuenta con documentación interactiva generada automáticamente con **Swagger/OpenAPI 3.0**.

| Recurso | URL |
|---------|-----|
| **Swagger UI** (interactivo) | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |
| **OpenAPI Spec** (JSON) | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |

La documentación se genera a partir de comentarios **JSDoc `@swagger`** en los archivos `route.ts` de la API. Al agregar o modificar un endpoint, agrega el bloque JSDoc correspondiente y Swagger lo detectará automáticamente.

---

## 📄 Licencia

Este proyecto está bajo la licencia incluida en el archivo [LICENSE](./LICENSE).
