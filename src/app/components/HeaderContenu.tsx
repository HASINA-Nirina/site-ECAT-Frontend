import React from "react";
import Image from "next/image";
import background from "@/app/assets/background.png";
import etudiant from "@/app/assets/etudiant.png";

const HeaderContenu = () => {
  return (
    <section
      className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-24 md:pt-32"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} 
    >
      {/* Texte descriptif */}
      <div className="flex-1 text-center md:text-left text-black space-y-6 md:space-y-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-full md:max-w-5xl mx-auto md:mx-0">
          Bienvenue à l&apos;Université ECAT TARATRA Fianarantsoa
        </h1>

        <p className="text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0">
          L’Université ECAT Taratra est une institution moderne dédiée à la formation
          en ligne et en présentiel. Elle offre des programmes complets et adaptés aux
          besoins actuels du marché du travail à Madagascar et à l’international.
        </p>
        <p className="text-base sm:text-lg md:text-xl max-w-md mx-auto md:mx-0">
          Elle aussi vise à former des professionnels compétents,
          capables de relever les défis du monde moderne, tout en valorisant
          l’excellence académique et l’innovation pédagogique.
        </p>

        {/* Ligne de séparation avant le bouton */}
        <div className="w-24 md:w-32 h-1 bg-gray-800 mx-auto md:mx-0 rounded mb-4 md:mb-6"></div>

        {/* Bouton Voir Plus */}
        <div>
          <a
            href="https://ecat.phids.mg/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          >
            Voir plus
          </a>
        </div>
      </div>

      {/* Image circulaire responsive */}
      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <Image
          src={etudiant}
          alt="Étudiant"
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full object-cover border-none bg-transparent shadow-none"
          priority
        />
      </div>
    </section>
  );
};

export default HeaderContenu;
