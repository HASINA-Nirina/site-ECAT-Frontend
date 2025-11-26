"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Eye } from "lucide-react";
// Remplacement de next/image par une balise <img> standard pour la compatibilité de l'environnement
// import Image from "next/image"; 

// Définition de l'interface Book
interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  urlPdf: string; // Chemin du fichier PDF, ex: static/uploads/mon_livre.pdf
}

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Récupération de l'ID utilisateur
  const idUser = typeof window !== "undefined" ? localStorage.getItem("iduser") : null;

  // Fonction pour gérer le téléchargement/ouverture du livre
  const handleReadNow = (urlPdf: string) => {
    // Extraire uniquement le nom du fichier à partir du chemin complet (ex: static/uploads/filename.pdf -> filename.pdf)
    const parts = urlPdf.split('/');
    const filename = parts[parts.length - 1];
    
    // Construire l'URL de l'API en utilisant l'endpoint /filesdownload
    const downloadUrl = `http://127.0.0.1:8000/filesdownload/${encodeURIComponent(filename)}`;
    
    // Ouvrir le fichier dans un nouvel onglet
    window.open(downloadUrl, "_blank");
  };

  useEffect(() => {
    const fetchBooks = async () => {
      if (!idUser) {
        setLoading(false);
        setBooks([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/livre/livreDebloqueEtudiant/${idUser}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Erreur fetch:", res.status, await res.text());
          setBooks([]);
          return;
        }

        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Erreur réseau :", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [idUser]);

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black";
  const cardClass = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(search?.toLowerCase() ?? "")
  );

  if (loading) {
    return (
      <main className={`flex-1 p-6 ${bgClass}`}>
        <p className="text-center text-gray-400">Chargement des livres...</p>
      </main>
    );
  }

  return (
    <main className={`flex-1 p-6 ${bgClass}`}>
      {/* ===== Titre + barre de recherche ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={28} color="#17f" /> Livres débloqués
        </h1>

        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder={lang === "fr" ? "Rechercher un livre..." : "Search a book..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-[#17f] transition ${
              darkMode
                ? "bg-gray-800 text-white border-[#17f] placeholder-gray-400"
                : "bg-white border-[#17f] text-gray-800 placeholder-gray-500"
            }`}
          />
        </div>
      </div>

      {/* ===== Liste des livres débloqués (Grille simplifiée) ===== */}
      {/* Modification de la grille pour un affichage plus dense (comme la vidéo) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
            return (
              <div
                key={book.id}
                className={`rounded-xl shadow-lg border ${borderClass} ${cardClass} overflow-hidden flex flex-col hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300`}
              >
                {/* Image de couverture - Utilisation de <img> à la place de <Image> */}
                <div className="relative w-full h-40 md:h-56 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={`http://localhost:8000/${book.image}`}
                    alt={book.title}
                    // Pour simuler layout="fill" et objectFit="cover"
                    className="w-full h-full object-cover transition duration-300 hover:opacity-90"
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow justify-between gap-2">
                  {/* Titre et Auteur */}
                  <div>
                    <h2 className="text-base font-semibold truncate mb-1">{book.title}</h2>
                    <p className="text-sm opacity-70 text-gray-500 dark:text-gray-400 truncate">
                      {book.author}
                    </p>
                  </div>

                  {/* Bouton Lire maintenant - Lié à l'endpoint de téléchargement */}
                  <button
                    onClick={() => handleReadNow(book.urlPdf)}
                    className="mt-2 flex items-center justify-center gap-2 bg-[#17f] hover:bg-[#0f0fcf] text-white py-2 rounded-lg font-medium transition duration-200 shadow-md shadow-[#17f]/50"
                  >
                    <Eye size={18} /> Lire maintenant
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center opacity-70 mt-8">
            Aucun livre débloqué trouvé pour “{search}”
          </p>
        )}
      </div>
    </main>
  );
}