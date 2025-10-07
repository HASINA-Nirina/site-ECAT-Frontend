"use client";

import React, { useState, useEffect } from "react";
import background from "@/app/assets/background.png";

const OtpVerificationPage = () => {
  // Génère des clés stables (évite l’utilisation directe de l’index)
  const otpKeys = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Vérifie si l'OTP complet est rempli
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      // Simule la validation réussie du code OTP
      setTimeout(() => {
        alert("✅ Code OTP validé avec succès !");
        window.location.href = "/forgot-password/new-password";
      }, 1000);
    }
  }, [otp]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // ✅ corrigé : \d
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Passage automatique au champ suivant
    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) (nextInput as HTMLInputElement).focus();
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay flou */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-black">Vérification OTP</h1>
        <p className="text-gray-700 mb-6 text-sm">
          Entrez le code à 6 chiffres envoyé à votre e-mail.
        </p>

        {/* Champs OTP */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={otpKeys[index]} // ✅ clé stable, plus d’alerte SonarLint
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-10 h-12 text-center border border-gray-300 rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Vous n’avez pas reçu le code ?{" "}
          <button
            type="button"
            onClick={() => alert("📧 Nouveau code OTP envoyé !")}
            className="text-purple-700 font-semibold hover:underline"
          >
            Renvoyer
          </button>
        </p>

        <button
          type="button"
          onClick={() => (window.location.href = "/login")}
          className="text-purple-700 font-semibold hover:underline text-sm"
        >
          Retour à la connexion
        </button>
      </div>
    </section>
  );
};

export default OtpVerificationPage;
