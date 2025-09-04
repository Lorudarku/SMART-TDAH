// ===============================
// Configuración de la URL base del backend
// Lee siempre de la variable de entorno REACT_APP_BACKEND_URL
// Alterna entre localhost y red local editando .env.local, nunca aquí
// ===============================
export const backendUrl = process.env.REACT_APP_BACKEND_URL;