"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.jpeg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegisterChoice, setShowRegisterChoice] = useState(false);

  return (
    <>
      {/* ✅ Header principal */}
      <header
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50
          bg-white md:bg-transparent transition-colors
          shadow-md md:shadow-none`}
      >
        {/* Logo + Texte */}
        <div className="flex items-center space-x-3">
          <Image
            src={logo}
            alt="Logo ECAT"
            width={50}
            height={50}
            className="rounded-full border border-white"
          />
          <span className="text-[#17f] md:text-sky-400 text-lg md:text-xl font-bold">
            Université ECAT TARATRA
          </span>
        </div>

        {/* Boutons (grand écran) */}
        <div className="hidden md:flex space-x-4">
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-white text-purple-700 font-semibold hover:bg-gray-200 transition"
          >
            Se connecter
          </a>
          <button
            onClick={() => setShowRegisterChoice(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            S’inscrire
          </button>
        </div>

        {/* Hamburger menu (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-purple-600 focus:outline-none text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Menu déroulant responsive */}
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-white rounded-lg shadow-lg flex flex-col w-40">
            <a
              href="/login"
              className="px-4 py-2 text-purple-700 font-semibold hover:bg-gray-100"
            >
              Se connecter
            </a>
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowRegisterChoice(true);
              }}
              className="px-4 py-2 text-purple-700 font-semibold hover:bg-gray-100 text-left"
            >
              S’inscrire
            </button>
          </div>
        )}
      </header>

      {/* ✅ Popup flottant avec fond flou */}
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
    </>
  );
};

export default Header;