// 🚀 Système de cache pour les requêtes API
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Récupère les données du cache ou de l'API
   * @param key Clé unique pour le cache
   * @param url URL de l'API
   * @param ttl Durée de vie du cache en millisecondes (défaut: 5 minutes)
   */
  async get<T>(key: string, url: string, ttl: number = 5 * 60 * 1000): Promise<T> {
    // ✅ Si en cache et pas expiré
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`📦 Cache hit: ${key}`);
      return cached.data;
    }

    // ✅ Si requête déjà en cours, retourner la même promesse
    if (this.pendingRequests.has(key)) {
      console.log(`⏳ Waiting for pending request: ${key}`);
      return this.pendingRequests.get(key)!;
    }

    // ⚡ Sinon, faire la requête
    console.log(`🌐 Fetching: ${key}`);
    const promise = fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        this.cache.set(key, { data, timestamp: Date.now(), ttl });
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Invalider le cache
  invalidate(key: string) {
    this.cache.delete(key);
    console.log(`🗑️ Cache invalidated: ${key}`);
  }

  // Vider tout le cache
  clear() {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }
}

export const apiCache = new APICache();
