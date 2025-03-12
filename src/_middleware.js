import { NextResponse } from "next/server";

// Verificar si la autenticación está habilitada usando variable pública
const isAuthEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

// Middleware condicional basado en AUTH_ENABLED
export default function middleware(req) {
  // Si la autenticación está deshabilitada, siempre permitir acceso
  if (!isAuthEnabled) {
    return NextResponse.next();
  }

  // Solo importamos withAuth si la autenticación está habilitada
  // Esto evita cargar innecesariamente el módulo
  const { withAuth } = require("next-auth/middleware");
  
  // Si la autenticación está habilitada, usar withAuth
  const authMiddleware = withAuth(
    function authMiddleware(req) {
      const token = req.nextauth.token;
      const isAuth = !!token;
      const isAuthPage = req.nextUrl.pathname.startsWith("/login");
      
      // Redirigir a dashboard si el usuario está autenticado e intenta acceder a login/registro
      if (isAuthPage && isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      
      // Manejo específico de rutas admin
      if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!isAuth) {
          return NextResponse.redirect(new URL("/login", req.url));
        }
        
        if (token.role !== "admin") {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
      
      // Continuar con la solicitud
      return NextResponse.next();
    },
    {
      callbacks: {
        // Solo protege rutas específicas
        authorized: ({ token }) => !!token,
      },
    }
  );

  return authMiddleware(req);
}

// Definir las rutas que estarán protegidas por este middleware
export const config = { 
  matcher: isAuthEnabled ? 
    ["/dashboard/:path*", "/admin/:path*", "/api/protected/:path*", "/login"] : 
    [] // Si la autenticación está deshabilitada, no proteger ninguna ruta
};
