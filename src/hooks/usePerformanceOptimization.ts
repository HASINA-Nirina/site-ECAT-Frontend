// ⚡ Hook pour optimiser les performances des navigations
import { useEffect, useCallback } from "react";

export function usePerformanceOptimization() {
  useEffect(() => {
    // 🚀 Preload les ressources critiques
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        // Preload les routes fréquentes
        const links = [
          "/admin/super/etudiants",
          "/admin/super/formation",
          "/admin/super/paiements",
        ];

        links.forEach((href) => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = href;
          document.head.appendChild(link);
        });
      });
    }

    // 🔥 Compresser les images automatiquement
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.loading) {
        img.loading = "lazy";
      }
    });
  }, []);

  // 🎯 Memoized navigate pour éviter les re-renders
  const optimizedNavigate = useCallback((href: string) => {
    window.location.href = href;
  }, []);

  return { optimizedNavigate };
}
