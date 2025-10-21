"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterChoice, setShowRegisterChoice] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setSuccess(null);

    const data = { email, mot_de_passe: password };

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Résultat du backend:", result);

      // Vérifie si la requête HTTP a échoué
      if (!res.ok || result.error) {
        setIsLoading(false);
        setSuccess(false);
        setMessage(result.message || "Email ou mot de passe invalide !");
        return;
      }

      const { role, token } = result;

      if (!token || !role) {
        setIsLoading(false);
        setSuccess(false);
        setMessage("Réponse du serveur invalide !");
        return;
      }

      // ✅ Stocker le token et le rôle
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; secure; samesite=strict;`;

      setSuccess(true);
      setMessage("Connexion réussie !");
      setIsLoading(false);

      // Redirection selon le rôle
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/super/dashboard");
        } else if (role === "Admin Local") {
          router.push("/admin/local/dashboard");
        } else if (role === "etudiante") {
          router.push("/Etudiant/dashboard");
        } else {
          setMessage("Rôle inconnu !");
          setSuccess(false);
        }
      }, 1500);
    } catch (err) {
      console.error("Erreur réseau :", err);
      setIsLoading(false);
      setSuccess(false);
      setMessage("Erreur réseau ou serveur !");
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* ✅ Barre de progression */}
      {isLoading && (
        <div className="absolute top-4 right-4 w-32 h-2 bg-gray-200 rounded-full overflow-hidden shadow-md animate-pulse">
          <div className="bg-purple-600 h-full rounded-full animate-[progress_5s_linear_forwards]"></div>
          <style jsx>{`
            @keyframes progress {
              from {
                width: 0%;
              }
              to {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )}

      {/* Formulaire */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-purple-600 hover:text-purple-700 transition" />
              ) : (
                <Eye size={20} className="text-purple-600 hover:text-purple-700 transition" />
              )}
            </button>
          </div>

          <div className="flex justify-end mb-8">
            <a
              href="/ForgotPassword"
              className="text-purple-700 font-semibold hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-100 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} /> Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* ✅ Message de succès / erreur */}
        {message && (
          <div
            className={`flex justify-center items-center mt-4 font-medium text-center ${
              success === true
                ? "text-green-600"
                : success === false
                ? "text-red-600"
                : "text-purple-700"
            }`}
          >
            {success === true && <CheckCircle className="mr-2" size={18} />}
            {success === false && <XCircle className="mr-2" size={18} />}
            {message}
          </div>
        )}

        <p className="text-center text-black mt-4">
          Pas encore de compte ?{" "}
          <button
            onClick={() => setShowRegisterChoice(true)}
            className="text-purple-700 font-semibold hover:underline"
          >
            S&apos;inscrire
          </button>
        </p>
      </div>

      {showRegisterChoice && (
        <div
          className="fixed inset-0 flex justify-center items-center z-[100] backdrop-blur-md bg-black/40 transition"
        >
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center relative">
            <h2 className="text-xl font-bold text-purple-700 mb-4">
              Choisissez votre type d’inscription
            </h2>
            <div className="flex flex-col space-y-3">
              <a
                href="/EtudiantRegister"
                className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Étudiant
              </a>
              <a
                href="/AlocalRegister"
                className="bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition"
              >
                Administrateur Local
              </a>
            </div>
            <button
              onClick={() => setShowRegisterChoice(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default LoginPage;
