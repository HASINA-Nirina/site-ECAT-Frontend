// ✅ src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes protégées avec rôle requis
const roleProtectedRoutes: Record<string, string> = {
  "/admin/super": "admin",
  "/admin/local": "Admin Local",
  "/Etudiant/dashboard": "etudiante",
  "/Etudiant/Achatlivre": "etudiante",
  "/Etudiant/LivreDebloque": "etudiante",
  "/Etudiant/rapports": "etudiante",
  "/Etudiant/SettingCompte": "etudiante",
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Récupération du token depuis les cookies
  const token = req.cookies.get("token")?.value;

  // 🚫 Si pas de token -> rediriger vers login
  if (!token) {
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    // 🔒 Headers anti-cache pour empêcher le bouton retour de montrer la page protégée
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
    return response;
  }

  // ✅ Décoder le rôle depuis le token JWT
  const userRole = decodeRoleFromToken(token);

  // 🚫 Si le token est invalide ou corrompu -> rediriger vers login
  if (!userRole) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    // Supprimer le token invalide en réponse
    response.cookies.delete("token");
    // 🔒 Headers anti-cache
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // 🔒 Vérifier si la route est protégée et si le rôle correspond
  for (const path in roleProtectedRoutes) {
    if (req.nextUrl.pathname.startsWith(path)) {
      const requiredRole = roleProtectedRoutes[path];
      if (userRole !== requiredRole) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        // 🔒 Headers anti-cache
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        return response;
      }
    }
  }

  // ✅ Si tout va bien, autoriser la navigation avec headers anti-cache
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  return response;
}

// Fonction pour décoder le rôle depuis le token JWT
function decodeRoleFromToken(token: string): string | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    return decodedPayload.role || null;
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
}

// Appliquer le middleware uniquement aux routes protégées
export const config = {
  matcher: ["/admin/:path*", "/Etudiant/:path*"],
};
