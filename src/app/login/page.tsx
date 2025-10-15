"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterChoice, setShowRegisterChoice] = useState(false);
  const [message, setMessage] = useState("");
  const [successLogin, setSuccessLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = { email, password };

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status !== 200) {
        setMessage(result.detail || "Erreur serveur, veuillez réessayer plus tard.");
        setSuccessLogin(false);
        setLoading(false);
        return;
      }

      if (result.access_token) {
        // Décoder le JWT pour récupérer le rôle
        const payload = JSON.parse(atob(result.access_token.split(".")[1]));
        const role = payload.role;

        if (role === "admin_super") {
          setSuccessLogin(true);
          setTimeout(() => router.push("/admin/super/dashboard"), 1000);
        } else if (role === "etudiant") {
          router.push("/etudiant/dashboard");
        } else if (role === "admin_local") {
          router.push("/admin/local/dashboard");
        } else {
          setMessage("Rôle non autorisé pour accéder à cette page");
          setSuccessLogin(false);
        }
      } else {
        setMessage("Erreur serveur, veuillez réessayer plus tard.");
        setSuccessLogin(false);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage("Erreur serveur, veuillez réessayer plus tard.");
      setSuccessLogin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

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
              {showPassword ? <EyeOff size={20} className="text-purple-600 hover:text-purple-700 transition" /> :
                                <Eye size={20} className="text-purple-600 hover:text-purple-700 transition" />}
            </button>
          </div>

          <div className="flex justify-end mb-8">
            <a href="/ForgotPassword" className="text-purple-700 font-semibold hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-purple-700 font-medium">{message}</p>
        )}

        {successLogin && (
          <div className="flex items-center space-x-2 mt-4">
            <CheckCircle className="text-green-600" size={24} />
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-3 bg-green-500 animate-progress"
                style={{ width: "100%" }}
              ></div>
            </div>
            <span className="text-green-600 font-medium">Connexion réussie</span>
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
          style={{ backdropFilter: "blur(10px)" }}
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

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>
    </section>
  );
};

export default LoginPage;
