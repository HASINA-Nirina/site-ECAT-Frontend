// src/lib/api.js
export const apiFetch = async (endpoint, options = {}) => {
    const headers = { ...options.headers };
  
    // 💡 ASTUCE : Si le corps est un FormData, on laisse le navigateur 
    // gérer le Content-Type lui-même. Sinon, on met du JSON.
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  

  