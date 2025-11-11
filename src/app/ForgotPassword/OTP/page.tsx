"use client";

import React, { useState, useEffect, useRef } from "react";
import background from "@/app/assets/background.png";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const OtpVerificationPage = () => {
  const otpKeys = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const searchParams = useSearchParams();
  const [popup, setPopup] = useState<{ message: string; color: string } | null>(null);

  // ✅ Fonction pour afficher le popup animé
  const showPopup = (message: string, color: string) => {
    setPopup({ message, color });
    setTimeout(() => setPopup(null), 2500);
  };

  // ✅ Redirige automatiquement quand le code est complet
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      setTimeout(async () => {
        const email = searchParams.get("email");
        if (!email) {
          showPopup("⚠️ Aucun email trouvé. Retour à la page précédente.", "red");
          window.location.href = "/ForgotPassword";
        }

        try {
          const res = await fetch("http://127.0.0.1:8000/auth/verify", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              email: email,
              code: otp.join(""),
            }),
          });

          const data = await res.json();
          console.log("Réponse backend :", data);

          if (data.success) {
            showPopup("Code OTP validé avec succès !", "green");

            const email = searchParams.get("email");
            if (!email) {
              showPopup("⚠️ Email introuvable.", "red");
              window.location.href = "/ForgotPassword";
              return;
            }

            setTimeout(() => {
              window.location.href = `/ForgotPassword/NewPassword?email=${encodeURIComponent(email)}`;
            }, 1500);
          } else {
            showPopup(`❌ ${data.message}`, "red");
          }
        } catch (error) {
          console.error("Erreur lors de la vérification OTP :", error);
          showPopup("⚠️ Erreur serveur. Réessaie plus tard.", "red");
        }
      }, 800);
    }
  }, [otp]);

  // ✅ Gère la saisie
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // ✅ Gestion du collage automatique
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  // ✅ Navigation clavier gauche/droite
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    else if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
    else if (e.key === "Backspace" && otp[index] === "" && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  // ✅ Renvoi du code OTP
  const handleResendOtp = async () => {
    const email = searchParams.get("email");
    if (!email) {
      showPopup("⚠️ Email introuvable.", "red");
      window.location.href = "/ForgotPassword";
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.message) {
        showPopup("📧 Nouveau code OTP envoyé !", "green");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        showPopup(`❌ ${data.message}`, "red");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi OTP :", error);
      showPopup("⚠️ Erreur serveur. Réessaie plus tard.", "red");
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* Overlay flou */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* ✅ Message Popup animé */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-50 
              ${popup.color === "green" ? "bg-green-600" : "bg-red-600"}`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg mx-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-black">Vérification OTP</h1>
        <p className="text-gray-700 mb-6 text-sm">
          Entrez le code à 6 chiffres envoyé à votre e-mail.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={otpKeys[index]}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center border border-gray-300 rounded-lg text-black text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 sm:w-12 sm:h-14"
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Vous n’avez pas reçu le code ?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
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
