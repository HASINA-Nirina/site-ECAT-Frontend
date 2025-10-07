"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation"; 





const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterChoice, setShowRegisterChoice] = useState(false);
  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const data = {
    email: email,
    role: string,
    mot_de_passe: password,
  };

  const res = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log(data.role); 

  if (res.ok) {
    if (data.role === "admin") {
        router.push("/admin/super/dashboard");
      } else if (data.role === "local") {
        
      } else {
        
      }
    }
 else {
    alert("Erreur : " + result.detail);
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Mot de passe oublié */}
          <div className="flex justify-end mb-4">
            <a href="/forgot-password" className="text-sm text-purple-700 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>

        {/* Lien inscription */}
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

      {/* Popup modal */}
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
    </section>
  );
};

export default LoginPage;
