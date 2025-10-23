"use client";

import React, { useState } from "react";
import background from "@/app/assets/background.png";
//import { useRouter } from "next/router";
import { useRouter } from "next/navigation"; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
    const res = await fetch("http://127.0.0.1:8000/auth/sendOtp",{
        method : "POST",
        headers : {"Content-type": "application/json"},
        body :JSON.stringify({
          email: email,
        })
    })
     
  
    const data = await res.json();
    if (data.message) {
      alert("✅ Un code OTP a été envoyé à votre adresse e-mail.");
     // localStorage.setItem("email", email);
     // router.push("/ForgotPassword/OTP?email=${encodeURIComponent(email)}");
      window.location.href = `/ForgotPassword/OTP?email=${encodeURIComponent(email)}`;

    } else if (data.error){
      setMessage("❌ Cette adresse e-mail n’existe pas dans notre base.");
    }
    else{
      setMessage("erreur inconue")
    }
  }catch (err){
    setMessage("Erreu d'envoi ")
  }
    // ⚠️ Simule la vérification (dans le vrai cas, tu appellerais une API)
    
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay flou */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-black">
          Mot de passe oublié
        </h1>
        <p className="text-center text-gray-700 mb-6 text-sm">
          Entrez votre adresse e-mail pour recevoir un code OTP.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Continuer
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-black mt-6">
          <a
            href="/login"
            className="text-purple-700 font-semibold hover:underline"
          >
            Retour à la connexion
          </a>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
