/**
 * Configuración centralizada para la aplicación
 */

// Verificar si la autenticación está habilitada mediante la variable de entorno
export const isAuthEnabled = process.env.AUTH_ENABLED === "true";

// Rutas que requieren autenticación cuando AUTH_ENABLED está activado
export const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/api/protected",
];

// Rutas que requieren permisos de administrador
export const adminRoutes = [
  "/admin",
  "/api/admin",
];

// Rutas de autenticación
export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
];

// comprobar si una ruta necesita autenticación
export const isProtectedRoute = (path) => {
  if (!isAuthEnabled) return false;
  return protectedRoutes.some(route => path.startsWith(route));
};

// comprobar si una ruta necesita permisos de administrador
export const isAdminRoute = (path) => {
  if (!isAuthEnabled) return false;
  return adminRoutes.some(route => path.startsWith(route));
};

// comprobar si una ruta es una página de autenticación
export const isAuthRoute = (path) => {
  if (!isAuthEnabled) return false;
  return authRoutes.some(route => path.startsWith(route));
};
