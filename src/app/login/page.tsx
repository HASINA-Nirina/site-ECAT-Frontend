"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle} from "lucide-react";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.jpeg";
import Image from "next/image";

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

      // côté frontend, dans handleSubmit après `const result = await res.json();`
      if (!res.ok) {
        // backend a renvoyé HTTPException avec `detail`
        setIsLoading(false);
        setSuccess(false);

        // FastAPI renvoie { "detail": "Votre compte est en attente..." } si on a utilisé HTTPException
        const backendMessage = result.detail || result.message || "Email ou mot de passe invalide !";

        // Si message d'attente détecté → jaune
        if (backendMessage && backendMessage.toLowerCase().includes("en attente")) {
          setMessage("Votre compte est en attente de validation. Veuillez contacter l'administrateur.");
          setSuccess(null); // ni succès ni erreur rouge ; on utilisera style jaune
          setIsLoading(false);
          return;
        }

        if (backendMessage && backendMessage.toLowerCase().includes("refus")) {
          setMessage("Votre compte a été refusé par l’administrateur. Vous ne pouvez pas vous connecter.");
          setSuccess(false); // rouge
          setIsLoading(false);
          return;
        }

        // Sinon erreur normale
        setMessage(backendMessage);
        return;
      }

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
      

      // Redirection selon le rôle
      
      setTimeout(() => {
        setIsLoading(false); // blur + barre disparaissent
        //redirection Immediate
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
      }, 200);
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

      {/* Formulaire */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4 overflow-hidden">
      {/* ✅ Barre de progression violette */}
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-200 overflow-hidden rounded-t-2xl">
            <div className="h-1 w-1/3 bg-purple-600 animate-slide"></div>
          </div>
        )}

        {/* ✅ Contenu avec effet de flou quand isLoading */}
        <div
          className={`${isLoading ? "pointer-events-none select-none" : ""}`}
          style={{
            filter: isLoading ? "blur(1px)" : "none",
            transition: "filter 0.3s ease",
          }}
        >
          
      {/* HEADER RELOOKÉ (au-dessus de Connexion) */}
      <div className="w-full overflow-hidden">

        {/* Bloc bleu avec arrondis parfaits */}
        <div
          className="w-full px-5 py-6 text-center rounded-t-2xl"
          style={{
            background: "linear-gradient(to bottom, #004aad, #0d6efd)",
          }}
        >
          {/* Texte principal */}
          <h1 className="text-2xl font-extrabold text-white drop-shadow-md">
            Bienvenue à l&apos;Université ECAT TARATRA
          </h1>

          {/* Logo centré */}
          <div className="flex justify-center mt-4">
            <Image
              src={logo}
              alt="Logo ECAT"
              width={95}
              height={95}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        {/* Ligne séparatrice */}
        <div className="w-full h-1 bg-gray-300/60 backdrop-blur-sm"></div>

      </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-black mt-7">
          Connexion
        </h2>

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
            className={`w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-100 ${
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
                : message.toLowerCase().includes("en attente")
                ? "text-yellow-600"
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
      <style jsx>{`
      @keyframes slide {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      .animate-slide {
        animation: slide 1.8s ease-in-out infinite;
      }
    `}</style>
    </section>
  );
};

export default LoginPage;