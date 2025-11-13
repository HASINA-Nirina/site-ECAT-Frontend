"use client";


import { useState, useEffect } from "react";
import { BookOpen, Search, Eye } from "lucide-react";
interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  //progress: string;
  image: string;
  urlPdf: string;
}


export default function MainContent({ darkMode, lang}: MainContentProps) {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  


  const idUser = typeof window !== "undefined" ? localStorage.getItem("iduser") : null;

  useEffect(() => {
  const idUser = localStorage.getItem("iduser");
  

    const fetchBooks = async () => {
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

       const data = await res.json();
      
        setBooks(data);
      } catch (err) {
        console.error("Erreur réseau :", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (idUser) {
      fetchBooks();
    } else {
      setLoading(false);
      setBooks([]);
    }
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


  const getProgressColor = (progress: string) => {
    const value = parseInt(progress);
    if (value >= 70) return "#17f"; // Bleu vif
    if (value >= 30) return "#fbbf24"; // Jaune
    return "#f43f5e"; // Rouge
  };

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

      {/* ===== Liste des livres débloqués ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
           // const progressColor = getProgressColor(book.progress);
            return (
              <div
                key={book.id}
                className={`rounded-2xl overflow-hidden shadow-md border ${borderClass} ${cardClass} hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer`}
              >
                {/* Image area similar to MainContentFormation: show image if present, otherwise initial */}
                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-4xl">
                      {(book.title || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold truncate">{book.title}</h2>
                  <p className="text-sm opacity-80">{book.author}</p>

                  {/* Barre de progression stylisée (vide si pas de progress) */}
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                    <div className="h-3 rounded-full transition-all" />
                  </div>

                  {/* Bouton Lire maintenant */}
                  <button
                    onClick={() => window.open(book.urlPdf, "_blank")}
                    className="mt-2 flex items-center justify-center gap-2 bg-[#17f] hover:bg-[#0f0fcf] text-white py-2 rounded-lg font-medium transition"
                  >
                    <Eye size={18} /> {lang === "fr" ? "Lire maintenant" : "Read now"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center opacity-70">
            Aucun livre débloqué trouvé pour “{search}”
          </p>
        )}
      </div>
    </main>
  );
}
