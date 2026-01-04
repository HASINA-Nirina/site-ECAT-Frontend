import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requiredRole?: string) {
  const router = useRouter();

  useEffect(() => {
    // Vérifier le token au montage du composant
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      // Token supprimé → redirige vers login
      router.replace("/login");
      return;
    }

    // Si un rôle est requis, vérifier qu'il correspond
    if (requiredRole && role !== requiredRole) {
      router.replace("/login");
      return;
    }

    // Vérifier régulièrement que le token existe encore (détecte la déconnexion)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        router.replace("/login");
        clearInterval(interval);
      }
    }, 1000); // Vérifier chaque 1 seconde

    return () => clearInterval(interval);
  }, [router, requiredRole]);
}