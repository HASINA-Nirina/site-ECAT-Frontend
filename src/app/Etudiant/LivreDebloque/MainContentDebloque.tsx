"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Eye, FileX, MessageCircle } from "lucide-react";
import Image from "next/image";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";
import { apiFetch } from "@/lib/api";

// Définition de l'interface Book
interface Book {
  id: number;
  title: string;
  author: string;
  image?: string;
  pdf: string; // Chemin du fichier PDF, ex: static/uploads/mon_livre.pdf
}

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  
   // Helper pour normaliser les URLs d'images
   const normalizeImage = (raw: any): string => {
    try {
      if (!raw) return "";
  
      const s = String(raw).trim();
      
      // 1. Si c'est déjà une URL complète ou un blob, on ne touche à rien
      if (s.startsWith("blob:") || s.startsWith("http://") || s.startsWith("https://")) {
        return s;
      }
  
      // 2. On récupère l'URL de base depuis le .env
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
      // 3. On construit l'URL proprement en gérant le slash
      if (s.startsWith("/")) {
        return `${baseUrl}${s}`;
      }
      
      return `${baseUrl}/${s}`;
  
    } catch {
      return "";
    }
  };
  const idUser = typeof window !== "undefined" ? localStorage.getItem("iduser") : null;
  useEffect(() => {
    let isMounted = true;
  
    const fetchBooks = async () => {
      if (!idUser) return;
  
      setLoading(true);
      try {
        const res = await apiFetch(`/livre/livreDebloqueEtudiant/${idUser}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        const json = await res.json();
        if (isMounted) {
          const data: Book[] = (json.livres ?? json).map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            image:normalizeImage(b.image ?? b.cover ?? ""),
            pdf: b.pdf, 
          }));
          setBooks(data);
        }
  
      } catch (err) {
        if (isMounted) setBooks([]);
        console.error("Erreur fetch livres :", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchBooks();
    return () => { isMounted = false; };
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
            const imageUrl = book.image
  ? (book.image.startsWith("/") ? book.image : "/" + book.image)
  : null;

            return (
              <div
                key={book.id}
                className={`rounded-xl shadow-lg border ${borderClass} ${cardClass} overflow-hidden flex flex-col hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300`}
              >
                {/* Image de couverture - Utilisation de <img> à la place de <Image> */}
              
                <div className="relative w-full h-48 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={book.title || "LIVRE"}
                    fill
                    className="object-cover w-full h-full"
                  /> ) : (
                        <div className="w-full h-full bg-blue-200 flex items-center justify-center text-white font-bold text-2xl">
                          {book.title.charAt(0).toUpperCase()}
                        </div>
                      )}
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
                     onClick={() => {   
                      if (!book.pdf) {
                        alert("Aucun fichier disponible");
                        return;
                      }
                      // Utiliser l'URL de l'API (évitez de hardcoder 127.0.0.1 si possible, utilisez votre variable API_URL)
                      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/forum/filesdownload/${encodeURIComponent(book.pdf)}`;
                      window.open(downloadUrl, "_blank");
                    }}
                    
                    className="mt-2 flex items-center justify-center gap-2 bg-[#17f] hover:bg-[#0f0fcf] text-white py-2 rounded-lg font-medium transition duration-200 shadow-md shadow-[#17f]/50"
                  >
                    <Eye size={18} /> Lire maintenant
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center mt-30">
            <FileX className="w-20 h-20 text-red-500 mb-4" />
            <p className="text-center opacity-70 text-lg">
              Aucun livre débloqué {search} trouvé
            </p>
          </div>
        )}
      </div>
       {/* Floating message button */}
       <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
        title="Messages"
        onClick={() => setShowMessage(true)}
      >
        <MessageCircle size={28} />
      </button>

      {/* Utilisation du composant MessagePopup simulé localement */}
      {showMessage && (
        <MessagePopup
          darkMode={darkMode}
          onClose={() => setShowMessage(false)}
        />
      )}
    </main>
  );
}