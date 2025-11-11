"use client";

import React, { useState, useEffect } from "react";
import background from "@/app/assets/background.png";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowPopup(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/sendOtp", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.message) {
        // ✅ au lieu de alert()
        setMessage("✅ Un code OTP a été envoyé à votre adresse e-mail.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);

        setTimeout(() => {
          window.location.href = `/ForgotPassword/OTP?email=${encodeURIComponent(email)}`;
        }, 1500);
      } else if (data.error) {
        setMessage("❌ Cette adresse e-mail n’existe pas dans notre base.");
      } else {
        setMessage("Erreur inconnue");
      }
    } catch (err) {
      setMessage("Erreur d'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay flou */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4 overflow-hidden">
        {/* Barre animée */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-200 overflow-hidden rounded-t-xl">
            <div className="h-1 w-1/3 bg-purple-600 animate-slide"></div>
          </div>
        )}

        {/* Contenu floutté pendant le chargement */}
        <div
          className={`${loading ? "pointer-events-none select-none" : ""}`}
          style={{
            filter: loading ? "blur(1px)" : "none",
            transition: "filter 0.3s ease",
          }}
        >
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
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
      </div>

      {/* ✅ Popup animé en bas à droite */}
      {showPopup && (
        <div className="fixed bottom-5 right-5 animate-popupSlideIn bg-white text-black px-5 py-4 rounded-lg shadow-lg border-t-4 border-green-500 z-50">
          <p className="font-semibold text-sm">
            ✅ Un code OTP a été envoyé à votre adresse e-mail.
          </p>
        </div>
      )}

      {/* Animations */}
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

        @keyframes popupSlideIn {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          20% {
            opacity: 1;
            transform: translateX(0);
          }
          80% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        .animate-popupSlideIn {
          animation: popupSlideIn 5s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default ForgotPasswordPage;
