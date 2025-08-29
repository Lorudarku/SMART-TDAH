
# SMART-TDAH

> **Este documento está dispoñíbel en galego, castelán e inglés. Consulta o final do README para as versións traducidas.**

> **Este documento está disponible en gallego, castellano e inglés. Consulta el final del README para las versiones traducidas.**

> **This document is available in galician, spanish and english. Consult the end of the README to see traduced versions.**

## Galego

> Aplicación web para a xestión e análise de exercicios para nenos con TDAH. Desenvolta como Traballo de Fin de Grao por Ángel Álvarez Rey.

---

## Índice
1. [Descrición xeral](#descrición-xeral)
2. [Arquitectura do proxecto](#arquitectura-do-proxecto)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Execución en local](#execución-en-local)
6. [Estrutura dos directorios](#estrutura-dos-directorios)
7. [Despregue](#despregue)
8. [Tecnoloxías empregadas](#tecnoloxías-empregadas)

---

## Descrición xeral
SMART-TDAH é unha plataforma web que permite a profesores xestionar, visualizar e analizar o progreso de alumnos con TDAH a través de exercicios personalizados. Inclúe funcionalidades de autenticación, visualización de estatísticas, xestión de usuarios e integración con servizos de IA para análise avanzada.

## Arquitectura do proxecto
O proxecto segue unha arquitectura cliente-servidor:
- **Frontend:** React + Material UI (directorio `smart-tdah-frontend`)
- **Backend:** Node.js + Express (directorio `smart-tdah-backend`)
- **Base de datos:** PostgreSQL
- **APIs externas:** Integración con servizos de IA (Gemini, Mistral, Groq)

## Requisitos previos
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Git
- (Opcional) Docker para despregue

## Instalación
1. **Clona o repositorio:**
	 ```bash
	 git clone https://github.com/Lorudarku/SMART-TDAH
	 cd SMART-TDAH
	 ```
2. **Instala as dependencias do backend:**
	 ```bash
	 cd smart-tdah-backend
	 npm install
	 ```
3. **Instala as dependencias do frontend:**
	 ```bash
	 cd /smart-tdah-frontend
	 npm install
	 ```

## Execución en local
### 1. Configura a base de datos
- Crea unha base de datos PostgreSQL e configura as credenciais no arquivo `.env` do backend.

### 2. Inicia o backend
```bash
cd smart-tdah-backend/
npm start
```
Por defecto, o backend escoita en `http://localhost:3001`.

### 3. Inicia o frontend
```bash
cd smart-tdah-frontend/
npm start
```
Por defecto, o frontend está dispoñible en `http://localhost:3000`.

## Estrutura dos directorios

```
SMART-TDAH/
├── smart-tdah-backend/      # Backend (API, DB)
├── smart-tdah-frontend/     # Frontend (React)
└── README.md                # Esta guía
```

### Backend
- `server.js`: Punto de entrada do servidor Express.
- `dbConfig.js`: Configuración da conexión a PostgreSQL.
- `dbCompleteSetup/`: Scripts para crear e poboar a base de datos (non incluídos no repositorio).
- `routes/`: Rutas da API e integración con servizos de IA.
- `users/`: Lóxica de xestión de usuarios.

### Frontend
- `src/`: Código fonte React.
- `components/`: Compoñentes reutilizables (listas, formularios, gráficos, etc).
- `pages/`: Páxinas principais da aplicación.
- `utils/`: Utilidades e constantes.

## Despregue

### Backend
- Configura as variables de entorno en `.env` (ver exemplo `.env.example`).
- Despregue recomendado en servidores Linux (por exemplo, usando PM2 ou Docker).

### Frontend
- O frontend pode despregarse en calquera servizo de hosting estático (Vercel, Netlify, etc) ou xunto ao backend usando un proxy.

## Tecnoloxías empregadas

- **Frontend:** React, Material UI, Axios, Recharts, date-fns, pdfmake, etc.
- **Backend:** Node.js, Express, PostgreSQL, bcrypt, dotenv, etc.
- **APIs externas:** Gemini, Mistral, Groq (requiren clave de API)
- **Control de versións:** Git, GitHub


---

## Traducción al castellano

> Aplicación web para la gestión y análisis de ejercicios para niños con TDAH. Desarrollada como Trabajo de Fin de Grado por Ángel Álvarez Rey.

### Índice
1. [Descripción general](#descripción-general)
2. [Arquitectura del proyecto](#arquitectura-del-proyecto)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Ejecución en local](#ejecución-en-local)
6. [Estructura de los directorios](#estructura-de-los-directorios)
7. [Despliegue](#despliegue)
8. [Tecnologías empleadas](#tecnologías-empleadas)


### Descripción general
SMART-TDAH es una plataforma web que permite a los profesores gestionar, visualizar y analizar el progreso de alumnos con TDAH a través de ejercicios personalizados. Incluye funcionalidades de autenticación, visualización de estadísticas, gestión de usuarios e integración con servicios de IA para análisis avanzado.

### Arquitectura del proyecto
El proyecto sigue una arquitectura cliente-servidor:
- **Frontend:** React + Material UI (directorio `smart-tdah-frontend`)
- **Backend:** Node.js + Express (directorio `smart-tdah-backend`)
- **Base de datos:** PostgreSQL
- **APIs externas:** Integración con servicios de IA (Gemini, Mistral, Groq)

### Requisitos previos
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Git
- (Opcional) Docker para despliegue

### Instalación
1. **Clona el repositorio:**
	```bash
	git clone https://github.com/Lorudarku/SMART-TDAH
	cd SMART-TDAH
	```
2. **Instala las dependencias del backend:**
	```bash
	cd smart-tdah-backend
	npm install
	```
3. **Instala las dependencias del frontend:**
	```bash
	cd /smart-tdah-frontend
	npm install
	```

### Ejecución en local
#### 1. Configura la base de datos
- Crea una base de datos PostgreSQL y configura las credenciales en el archivo `.env` del backend.

#### 2. Inicia el backend
```bash
cd smart-tdah-backend/
npm start
```
Por defecto, el backend escucha en `http://localhost:3001`.

#### 3. Inicia el frontend
```bash
cd smart-tdah-frontend/
npm start
```
Por defecto, el frontend está disponible en `http://localhost:3000`.

### Estructura de los directorios

```
SMART-TDAH/
├── smart-tdah-backend/      # Backend (API, DB)
├── smart-tdah-frontend/     # Frontend (React)
└── README.md                # Esta guía
```

#### Backend
- `server.js`: Punto de entrada del servidor Express.
- `dbConfig.js`: Configuración de la conexión a PostgreSQL.
- `dbCompleteSetup/`: Scripts para crear y poblar la base de datos (no incluidos en el repositorio).
- `routes/`: Rutas de la API e integración con servicios de IA.
- `users/`: Lógica de gestión de usuarios.

#### Frontend
- `src/`: Código fuente React.
- `components/`: Componentes reutilizables (listas, formularios, gráficos, etc).
- `pages/`: Páginas principales de la aplicación.
- `utils/`: Utilidades y constantes.

### Despliegue

#### Backend
- Configura las variables de entorno en `.env` (ver ejemplo `.env.example`).
- Despliegue recomendado en servidores Linux (por ejemplo, usando PM2 o Docker).

#### Frontend
- El frontend puede desplegarse en cualquier servicio de hosting estático (Vercel, Netlify, etc) o junto al backend usando un proxy.

### Tecnologías empleadas

- **Frontend:** React, Material UI, Axios, Recharts, date-fns, pdfmake, etc.
- **Backend:** Node.js, Express, PostgreSQL, bcrypt, dotenv, etc.
- **APIs externas:** Gemini, Mistral, Groq (requieren clave de API)
- **Control de versiones:** Git, GitHub

---

## English translation

> Web application for the management and analysis of exercises for children with ADHD. Developed as a Bachelor's Thesis by Ángel Álvarez Rey.

### Index
1. [General description](#general-description)
2. [Project architecture](#project-architecture)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running locally](#running-locally)
6. [Directory structure](#directory-structure)
7. [Deployment](#deployment)
8. [Technologies used](#technologies-used)

### General description
SMART-TDAH is a web platform that allows teachers to manage, visualize, and analyze the progress of students with ADHD through personalized exercises. It includes authentication, statistics visualization, user management, and integration with AI services for advanced analysis.

### Project architecture
The project follows a client-server architecture:
- **Frontend:** React + Material UI (`smart-tdah-frontend` directory)
- **Backend:** Node.js + Express (`smart-tdah-backend` directory)
- **Database:** PostgreSQL
- **External APIs:** Integration with AI services (Gemini, Mistral, Groq)

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Git
- (Optional) Docker for deployment

### Installation
1. **Clone the repository:**
	```bash
	git clone https://github.com/Lorudarku/SMART-TDAH
	cd SMART-TDAH
	```
2. **Install backend dependencies:**
	```bash
	cd smart-tdah-backend
	npm install
	```
3. **Install frontend dependencies:**
	```bash
	cd /smart-tdah-frontend
	npm install
	```

### Running locally
#### 1. Set up the database
- Create a PostgreSQL database and configure the credentials in the backend `.env` file.

#### 2. Start the backend
```bash
cd smart-tdah-backend/
npm start
```
By default, the backend listens on `http://localhost:3001`.

#### 3. Start the frontend
```bash
cd smart-tdah-frontend/
npm start
```
By default, the frontend is available at `http://localhost:3000`.

### Directory structure

```
SMART-TDAH/
├── smart-tdah-backend/      # Backend (API, DB)
├── smart-tdah-frontend/     # Frontend (React)
└── README.md                # This guide
```

#### Backend
- `server.js`: Express server entry point.
- `dbConfig.js`: PostgreSQL connection configuration.
- `dbCompleteSetup/`: Scripts to create and populate the database (not included in the repository).
- `routes/`: API routes and AI service integration.
- `users/`: User management logic.

#### Frontend
- `src/`: React source code.
- `components/`: Reusable components (lists, forms, charts, etc).
- `pages/`: Main application pages.
- `utils/`: Utilities and constants.

### Deployment

#### Backend
- Configure environment variables in `.env` (see `.env.example`).
- Recommended deployment on Linux servers (e.g., using PM2 or Docker).

#### Frontend
- The frontend can be deployed on any static hosting service (Vercel, Netlify, etc) or together with the backend using a proxy.

### Technologies used

- **Frontend:** React, Material UI, Axios, Recharts, date-fns, pdfmake, etc.
- **Backend:** Node.js, Express, PostgreSQL, bcrypt, dotenv, etc.
- **External APIs:** Gemini, Mistral, Groq (API key required)
- **Version control:** Git, GitHub

---


