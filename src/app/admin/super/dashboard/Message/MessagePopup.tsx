"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    MessageSquare,
    Search,
    Send,
    ArrowLeft,
    X,
    Paperclip,
    Loader2,
    FileText,
    SquarePlus,
    Mail,
    MoreVertical
} from 'lucide-react';
import Image from "next/image";
// Types pour les données du backend
// ✅ MODIFICATION : Ajout de la propriété isCreator pour le contrôle d'accès au menu
interface Sujet {
    idSujet: number;
    titre: string;
    idCreateur: number;
    date_creation: string;
    image: string | null;
    messages?: Message[];
    isCreator?: boolean; 
}

// Interface pour les données de l'expéditeur
// `Sender` interface removed (inlined in `Message`) because it wasn't used separately

// Interface pour le message complet
interface Message {
    idMessage: number;
    idSujet: number;
    contenu: string;
    idSender: number;
    fichier?: string | null;
    date_creation: string;
    idParentMessage?: number | null;

    sender: {
        id: number;
        nom: string;
        prenom: string;
        image: string | null;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AVATAR_COLORS = [
    'bg-indigo-200', 'bg-pink-200', 'bg-yellow-200', 'bg-green-200',
    'bg-blue-200', 'bg-purple-200', 'bg-red-200', 'bg-orange-200'
];

// Mise à jour de l'interface pour accepter darkMode
interface MessagePopupProps {
    onClose?: () => void;
    darkMode: boolean;
}

// Fonction utilitaire pour obtenir les initiales
const getInitials = (titre: string): string => {
    const words = titre.split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return titre.substring(0, 2).toUpperCase();
};

// Fonction utilitaire pour obtenir une couleur d'avatar
const getAvatarColor = (id: number): string => {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
};

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};


// Mise à jour de l'export pour accepter la prop darkMode
export default function MessagePopup({ onClose, darkMode }: MessagePopupProps) {
    const [sujets, setSujets] = useState<Sujet[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loadingSujets, setLoadingSujets] = useState(true);
    const [loadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [newSujetTitre, setNewSujetTitre] = useState('');
    const [newSujetImage, setNewSujetImage] = useState<File | null>(null);
    const [creatingSujet, setCreatingSujet] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [idUser, setIdUser] = useState<number | null>(null);
    useEffect(() => {
        const storedId = localStorage.getItem("idUser");
        if (storedId) setIdUser(Number(storedId));
    }, []);
    // ✅ NOUVEAUX ÉTATS POUR LE MENU ET LA SUPPRESSION/MODIFICATION
    const [menuOpen, setMenuOpen] = useState<number | null>(null); // id du sujet ouvert
    const [deleteSujet, setDeleteSujet] = useState<Sujet | null>(null);
    const [editSujet, setEditSujet] = useState<Sujet | null>(null);

    // Helpers pour le popup de création/modification
    const isEditMode = editSujet !== null;
    const isPopupOpen = showCreatePopup || isEditMode;

    const activeChat = sujets.find(s => s.idSujet === activeChatId);
    // Debug: afficher l'état actuel
    useEffect(() => {
        console.log(' État actuel:', {
            idUser,
            sujetsCount: sujets.length,
            sujets,
            activeChatId,
            loadingSujets,
            error
        });
    }, [sujets, activeChatId, loadingSujets, error, idUser]);

    // ✅ NOUVEAU: useEffect pour pré-remplir le formulaire en mode modification
    useEffect(() => {
        if (editSujet) {
            setNewSujetTitre(editSujet.titre);
            // newSujetImage reste null, l'image actuelle sera conservée si l'utilisateur n'en choisit pas une nouvelle
        } else {
            // Réinitialiser les champs quand le popup se ferme ou passe en mode création
            setNewSujetTitre('');
            setNewSujetImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [editSujet]);

    // Récupérer les sujets
    const fetchSujets = useCallback(async () => {
        const storedId = localStorage.getItem("idUser");
        try {
            setLoadingSujets(true);
            setError(null);
            const url = `${API_URL}/forum/ReadSujet/${storedId}`;
            console.log(' Fetch sujets:', url);

            const response = await fetch(url, {
                credentials: "include",
            });

            console.log(' Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(' Erreur response:', errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            const data: Sujet[] = await response.json();
            console.log('Sujets reçus:', data);
            console.log(' Nombre de sujets:', data.length);

            setSujets(data);
            if (data.length > 0) {
                setActiveChatId(prev => prev ?? data[0].idSujet);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(`Impossible de charger les sujets: ${errorMessage}`);
            alert(' Erreur fetch sujets:' + err);
        } finally {
            setLoadingSujets(false);
        }
    }, []);

    //  FONCTION: Confirmer et exécuter la suppression d'un sujet
    const confirmDelete = async (idSujet: number) => {
        if (!idUser) {
            setError("Erreur: Utilisateur non identifié.");
            return;
        }

        try {
            // Le backend DELETE /DeleteSujet/{id} nécessite idCreateur comme Form Data
            const formData = new FormData();
            formData.append('idCreateur', idUser.toString());

            const response = await fetch(`${API_URL}/forum/DeleteSujet/${idSujet}`, {
                method: 'DELETE',
                credentials: "include",
                // Headers (Content-Type) n'est pas nécessaire pour FormData, fetch le gère
                body: formData, // Envoi de l'ID de l'utilisateur qui effectue la suppression
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            // Rafraîchir la liste des sujets et fermer le popup
            await fetchSujets();
            setDeleteSujet(null);
            if (activeChatId === idSujet) {
                setActiveChatId(null); // Désélectionner le sujet s'il était actif
            }
            // ❌ SUPPRIMÉ : Suppression du message de succès affiché via setError
            // setError(`Sujet "${deleteSujet?.titre}" supprimé avec succès.`); 

        } catch (err) {
            console.error("Erreur suppression sujet", err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(`Impossible de supprimer le sujet: ${errorMessage}`);
        }
    };

    // Récupérer les messages d'un sujet
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const setupWebSocket = (idSujet: number) => {
        // Réinitialiser les messages
        setMessages([]);
        // Créer la connexion WebSocket
        const websocket = new WebSocket(`ws://localhost:8000/forum/ws/${idSujet}`);

        websocket.onopen = () => {
            console.log('WebSocket connecté au sujet', idSujet);
        };

        websocket.onmessage = (event) => {
            try {
                const raw = JSON.parse(event.data);
                const message: Message = {
                    idMessage: raw.id || raw.idMessage || null,
                    idSender: Number(raw.idSender),
                    idSujet: Number(raw.idSujet),
                    contenu: raw.contenu,
                    fichier: raw.fichier || null,
                    date_creation: raw.date_creation,
                    idParentMessage: raw.idParentMessage || null,
                    sender: {
                        id: raw.sender?.id || raw.idSender,
                        nom: raw.sender?.nom || "Nom inconnu",
                        prenom: raw.sender?.prenom || "",
                        image: raw.sender?.image || null,
                    }
                };
                setMessages(prev => {
                    const newMessages = [message, ...prev]; // ajouter le message au début
                    return newMessages.sort(
                        (a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
                    );
                });
            } catch (err) {
                console.error("Erreur parsing WS:", err);
            }
        };

        websocket.onclose = () => console.log('WebSocket déconnecté');
        websocket.onerror = (err) => console.error('WebSocket error:', err);  
        wsRef.current = websocket;

        return () => {
            try {
                websocket.close();
            } catch (e) {
                console.warn('Erreur closing websocket', e);
            }
            wsRef.current = null;
        };

      //  setWs(websocket);

    //return () => websocket.close();
    };
    useEffect(() => {
        if (!activeChatId) return;
        const cleanup = setupWebSocket(activeChatId);

        return () => {
            cleanup();
        };
    }, [activeChatId]);

    // Envoyer un message
    const handleSendMessage = async () => {
        if ((!messageInput.trim() && !selectedFile) || !idUser || !activeChatId) return;

        try {
            setSendingMessage(true);

            const formData = new FormData();
            formData.append("idSender", idUser.toString());
            formData.append("idSujet", activeChatId.toString());
            formData.append("contenu", messageInput || "");
            if (selectedFile) {
                formData.append("fichier", selectedFile);
            }

            // Toujours utiliser fetch pour créer le message
            const response = await fetch(`${API_URL}/forum/ajouter_message`, {
                method: 'POST',
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }
            setMessageInput('');
            setSelectedFile(null);
            setupWebSocket(activeChatId);
        } catch (err) {
            console.error('Erreur en envoyant le message:', err);
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setSendingMessage(false);
        }
    };

    // Créer un nouveau sujet
    const handleCreateSujet = async () => {
        if (!newSujetTitre.trim() || !idUser || creatingSujet) {
            console.warn('⚠️ Validation échouée:', {
                titre: newSujetTitre.trim(),
                idUser,
                creatingSujet
            });
            return;
        }

        try {
            setCreatingSujet(true);
            setError(null);
            const formData = new FormData();
            formData.append('titre', newSujetTitre.trim());
            formData.append('idCreateur', idUser.toString());

            if (newSujetImage instanceof File) {
                formData.append('image', newSujetImage);
                console.log(' Image ajoutée:', newSujetImage.name);
            } else {
                console.log('Aucune image à envoyer');
            }

            const url = `${API_URL}/forum/NewSujet`;
            console.log('Création sujet:', url);
            console.log(' Données:', {
                titre: newSujetTitre.trim(),
                idCreateur: idUser.toString()
            });

            const response = await fetch(url, {
                method: 'POST',
                credentials: "include",
                body: formData
            });

            console.log(' Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur response:', errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log(' Sujet créé:', data);

            // Fermer le popup et réinitialiser les champs
            setShowCreatePopup(false);
            setNewSujetTitre('');
            setNewSujetImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Recharger la liste des sujets
            await fetchSujets();

            // Après création : ouvrir directement le nouveau sujet
            if (data.idSujet) {
                console.log('🎯 Ouverture du nouveau sujet:', data.idSujet);
                setActiveChatId(data.idSujet);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(`Erreur lors de l'ajout du sujet: ${errorMessage}`);
            console.error('❌ Erreur create sujet:', err);
        } finally {
            setCreatingSujet(false);
        }
    };

    // ✅ NOUVEAU: Modifier un sujet
    const handleUpdateSujet = async () => {
        if (!editSujet || !newSujetTitre.trim() || !idUser || creatingSujet) {
            console.warn('⚠️ Validation échouée (Update):', {
                editSujet: editSujet,
                titre: newSujetTitre.trim(),
                idUser,
                creatingSujet
            });
            return;
        }

        try {
            setCreatingSujet(true); // Réutilisation de l'état de chargement
            setError(null);
            const formData = new FormData();
            formData.append('titre', newSujetTitre.trim());
            formData.append('idCreateur', idUser.toString()); // idCreateur est requis par le backend PUT

            if (newSujetImage instanceof File) {
                formData.append('image', newSujetImage);
                console.log(' Nouvelle image ajoutée:', newSujetImage.name);
            } else {
                // Si aucune nouvelle image n'est sélectionnée, l'ancienne est conservée par le backend
                console.log('Aucune nouvelle image à envoyer.');
            }

            const url = `${API_URL}/forum/UpdateSujet/${editSujet.idSujet}`;
            console.log('Modification sujet (PUT):', url);

            // PUT request
            const response = await fetch(url, {
                method: 'PUT',
                credentials: "include",
                body: formData
            });

            console.log(' Response status (Update):', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur response (Update):', errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log(' Sujet modifié:', data);

            // Fermer le popup et réinitialiser les champs
            setEditSujet(null);
            setNewSujetTitre('');
            setNewSujetImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Recharger la liste des sujets
            await fetchSujets();

            // Réactiver le sujet actuel
            setActiveChatId(editSujet.idSujet);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(`Erreur lors de la modification du sujet: ${errorMessage}`);
            console.error('❌ Erreur update sujet:', err);
        } finally {
            setCreatingSujet(false);
        }
    };

    // Charger les sujets au montage et quand idUser change
    useEffect(() => {
        const idUser = localStorage.getItem("idUser");
        if (idUser) {
            console.log(' idUser trouvé, chargement des sujets...');
            fetchSujets();
        } else {
            console.warn('idUser est null dans localStorage');
        }
    }, [idUser, fetchSujets]);    // Logique d'upload de fichier pour les messages (pour l'instant juste un placeholder)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
        }
    };
    const handleSujetClick = (id: number) => {
        setActiveChatId(id);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
        setMenuOpen(null); // Fermer le menu lors du changement de sujet
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsSidebarOpen(true);
            else if (activeChatId) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeChatId]);

    // Filtrer les sujets selon la recherche
    const filteredSujets = sujets.filter(sujet =>
        sujet.titre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ----------------------------------------------------
    // Définition des classes de Thème (Light/Dark)
    // ----------------------------------------------------

    // Conteneurs principaux et arrière-plans
    const containerBg = darkMode ? "bg-gray-900" : "bg-white";
    const sidebarBg = darkMode ? "bg-gray-800 border-r-gray-700" : "bg-gray-100 border-r-gray-200";
    const headerBg = darkMode ? "bg-gray-800 border-b-gray-700" : "bg-white border-b-gray-200";
    const footerBg = darkMode ? "bg-gray-800 border-t-gray-700" : "bg-white border-t-gray-200";
    const chatWindowBg = darkMode ? "bg-gray-900" : "bg-gray-100";
    const generalText = darkMode ? "text-white" : "text-gray-800";
    const subtleText = darkMode ? "text-gray-400" : "text-gray-500";
    const borderDefault = darkMode ? "border-gray-700" : "border-gray-300";

    // Style de la bulle de message reçue - MODIFIÉ pour une forme plus douce
    const receivedBubble = darkMode
        ? "bg-gray-700 text-white rounded-2xl rounded-tl-sm border border-gray-600 shadow-md"
        : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-200 shadow-md";

    // Style du contact dans la sidebar
    const contactDefault = darkMode
        ? 'font-medium text-white hover:bg-gray-700 bg-gray-800/50 shadow-md'
        : 'font-medium text-gray-700 hover:bg-white bg-white/50';

    // Classes pour le style de l'input au focus ET au hover (violet)
    const inputInteractiveClasses = `focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-500`;

    // ----------------------------------------------------
    // RENDER SIDEBAR
    // ----------------------------------------------------

    const renderSidebar = () => (
        <div className={`flex flex-col w-full lg:w-96 ${sidebarBg} p-4 shadow-lg transition-all duration-300 ${window.innerWidth < 1024 && !isSidebarOpen ? 'hidden' : 'flex'}`}>
            <div className={`flex items-center justify-between py-4 mb-4 border-b ${borderDefault}`}>
                <h2 className={`text-2xl font-black ${generalText} tracking-wider flex items-center`}>
                    <MessageSquare className="w-6 h-6 text-indigo-600 mr-4 ml-2" />
                    Forums Messages
                </h2>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 text-indigo-600 hover:text-indigo-400 transition duration-150 rounded-lg"
                >
                    <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="mb-4 relative">
                <input
                    type="text"
                    placeholder="Rechercher un sujet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 p-2.5 text-sm rounded-xl border ${borderDefault} ${inputInteractiveClasses} transition shadow-sm ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                />
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${subtleText}`} />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                {loadingSujets ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        <span className={`ml-2 ${subtleText} text-sm`}>Chargement...</span>
                    </div>
                ) : filteredSujets.length === 0 ? (
                    <div className={`text-center py-8 ${subtleText} text-sm`}>
                        {searchQuery ? 'Aucun sujet trouvé' : sujets.length === 0 ? 'Aucun sujet disponible' : 'Aucun sujet ne correspond à votre recherche'}
                        {!searchQuery && sujets.length === 0 && (
                            <div className={`mt-2 text-xs ${subtleText}`}>
                                Créez votre premier sujet avec le bouton ci-dessous
                            </div>
                        )}
                    </div>
                ) : (
                    filteredSujets.map(sujet => {
                        const isActive = sujet.idSujet === activeChatId;
                        const initials = getInitials(sujet.titre);
                        const avatarColor = getAvatarColor(sujet.idSujet);
                        const lastMessage = sujet.messages && sujet.messages.length > 0
                            ? sujet.messages[sujet.messages.length - 1]
                            : null;
                        const timeDisplay = lastMessage ? formatDate(lastMessage.date_creation) : formatDate(sujet.date_creation);

                        return (
                            <div
                                key={sujet.idSujet}
                                className={`flex items-center p-3 text-sm rounded-xl shadow-sm cursor-pointer transition duration-150 ${
                                    isActive
                                        ? 'font-semibold text-white bg-indigo-600 hover:bg-indigo-700'
                                        : contactDefault
                                    }`}
                            >
                                {/* Avatar */}
                                <div
                                    onClick={() => handleSujetClick(sujet.idSujet)}
                                    className="relative w-10 h-10 mr-3 shrink-0"
                                >
                                 <div className="relative w-10 h-10 mr-3 shrink-0">
                                    {sujet.image ? (
                                        <Image
                                            src={`${API_URL}/uploads/forum/${sujet.image}`}
                                            alt={sujet.titre}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                    <div className={`w-full h-full ${avatarColor} rounded-full flex items-center justify-center font-semibold text-sm ${isActive ? 'text-white' : generalText}`}>
                                        {initials}
                                    </div>
                                )}
                            </div>
                                </div>

                                {/* Titre + dernier message */}
                                <div onClick={() => handleSujetClick(sujet.idSujet)} className="flex-1 overflow-hidden">
                                    <p className="truncate">{sujet.titre}</p>
                                    {lastMessage && (
                                        <p className={`text-xs ${isActive ? 'font-normal opacity-90' : subtleText} truncate`}>
                                            {lastMessage.contenu}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-xs ${isActive ? 'opacity-90' : subtleText} block`}>{timeDisplay}</span>
                                {/* Date + Menu MoreVertical */}
                                <div className="flex flex-col items-end ml-2 shrink-0 relative">
                                   

                                    {/* AFFICHAGE CONDITIONNEL DU MENU */}
                                    {sujet.isCreator && (
                                        <>
                                            {/* Icône 3 points (MoreVertical) */}
                                            <MoreVertical
                                                size={18}
                                                className={`cursor-pointer mt-1 ${isActive ? 'text-white' : subtleText} hover:text-indigo-400 transition-colors duration-150`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Empêche le clic de déclencher handleSujetClick
                                                    setMenuOpen(menuOpen === sujet.idSujet ? null : sujet.idSujet);
                                                }}
                                            />

                                            {/* Menu déroulant */}
                                            {menuOpen === sujet.idSujet && (
                                                <div
                                                    className={`absolute right-0 top-10 w-32 rounded-lg shadow-xl p-1.5 z-50 ${
                                                        darkMode ? "bg-gray-700 text-white border border-gray-600" : "bg-white text-gray-900 border border-gray-200"
                                                        }`}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditSujet(sujet); // Définit le sujet à modifier et ouvre le popup
                                                            setMenuOpen(null);
                                                        }}
                                                        className="block w-full text-left text-sm py-1.5 px-2 hover:bg-indigo-100 dark:hover:bg-gray-600 rounded transition duration-100"
                                                    >
                                                        Modifier
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteSujet(sujet); // Définit le sujet à supprimer
                                                            setMenuOpen(null);
                                                        }}
                                                        className="block w-full text-left text-sm py-1.5 px-2 hover:bg-red-100 dark:hover:bg-red-800 rounded text-red-600 dark:text-red-400 transition duration-100"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div >
                                            )}
                                        </>
                                    )}
                                    {!sujet.isCreator && <div className="mt-1 w-4 h-4"></div>}
                                </div>
                            </div>
                        );
                    })
                )}
                  </div>

            <div className={`mt-auto pt-4 border-t ${borderDefault}`}>
                
                <button
                    onClick={() => setShowCreatePopup(true)}
                    className={`
                // --- BASE : Forme et Disposition ---
                w-full flex items-center justify-center p-3 rounded-xl
                shadow-lg transition-all duration-300 ease-in-out
                font-semibold text-sm tracking-wide 
                
                // --- MODE CLAIR (Light Mode) : Vert-Jaune (Chartreuse) ---
                // Couleur par défaut
                bg-yellow-500 text-gray-900 border-b-2 border-yellow-600 // Texte sombre sur fond clair
                
                // États interactifs
                hover:bg-yellow-400 hover:shadow-xl hover:scale-[1.01]
                active:bg-yellow-400 active:border-b-2 active:translate-y-px 
                focus:outline-none focus:ring-4 focus:ring-yellow-300
                
                // --- MODE SOMBRE (Dark Mode) : Vert-Jaune (Chartreuse) ---
                dark:bg-amber-400 dark:text-gray-900 dark:border-amber-700 // Utilisation d'Amber pour plus de contraste en sombre
                
                // États interactifs en mode sombre
                dark:hover:bg-amber-400 dark:hover:shadow-xl 
                dark:active:bg-amber-400 dark:active:border-b-2
                dark:focus:ring-amber-400
                
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            `}
                    title="Créer un nouveau groupe"
                >
                    
                    <SquarePlus className="w-5 h-5 mr-2" />
                    <span>Nouveau Groupe</span>
                </button>

            </div>
        </div>
    );

    // ----------------------------------------------------
    // RENDER CHAT WINDOW
    // ----------------------------------------------------

    const renderChatWindow = () => (
        <div className={`flex-col flex-1 ${chatWindowBg} min-w-0 ${window.innerWidth < 1024 && isSidebarOpen ? 'hidden' : 'flex'}`}>
            <header className={`p-4 border-b ${borderDefault} ${headerBg} shadow-md flex items-center sticky top-0 z-10`}>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 text-indigo-600 hover:text-indigo-400 transition duration-150 rounded-lg mr-2"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="relative w-10 h-10 shrink-0 flex-col-reverse">
                    {activeChat?.image ? (
                        <Image
                            src={`${API_URL}/uploads/forum/${activeChat.image}`}
                            alt={activeChat.titre}
                            fill
                            className="rounded-full object-cover"
                        />

                    ) : (
                        <div className={`w-full h-full ${activeChat ? getAvatarColor(activeChat.idSujet) : 'bg-indigo-200'} rounded-full flex items-center justify-center font-semibold ${generalText}`}>
                            {activeChat ? getInitials(activeChat.titre) : '?'}
                        </div>
                    )}
                </div>
                <div className="ml-4 overflow-hidden flex-1">
                    <h3 className={`text-lg font-semibold ${generalText} truncate`}>{activeChat?.titre || 'Sélectionnez un sujet'}</h3>
                    <p className={`text-xs ${subtleText}`}>{activeChat ? `${messages.length} message${messages.length > 1 ? 's' : ''}` : ''}</p>
                </div>

                <button
                    onClick={onClose}
                    title="Fermer la fenêtre de chat"
                    className={`ml-4 p-2 ${subtleText} hover:text-red-500 hover:bg-gray-100 rounded-full transition duration-150 shrink-0 ${darkMode && 'hover:bg-gray-700'}`}
                >
                    <X className="w-6 h-6" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                ) : messages.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-70">
                        {/* Icône Lucide animée */}
                        <Mail
                            className="w-20 h-20 mb-4 text-purple-800"
                            style={{
                                animation: "swing 1.5s ease-in-out infinite"
                            }}
                        />

                        {/* Texte */}
                        <div className={`text-center text-sm ${subtleText}`}>
                            Aucun message pour le moment. Soyez le premier à écrire !
                        </div>

                        {/* Ajout des keyframes dans le style global ou dans un fichier CSS */}
                        <style jsx>{`
                        @keyframes swing {
                        0% { transform: rotate(-15deg); }
                        50% { transform: rotate(15deg); }
                        100% { transform: rotate(-15deg); }
                        }
                    `}</style>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isSent = message.idSender === idUser;
                        // Récupérer les initiales pour l'avatar du message reçu
                        const prenom = message.sender?.prenom || '';
                        const nom = message.sender?.nom || '';
                        const initials = (prenom[0] || '') + (nom[0] || '');
                        const avatarColor = getAvatarColor(message.idSender || 0);

                        return (
                            <div
                                key={message.idMessage}
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'} items-start`} // Ajout de items-start
                            >

                                {/* 💡 1. AVATAR (Pour messages Reçus seulement) */}
                                {!isSent && (
                                    <div className="relative w-8 h-8 mr-2 shrink-0">
                                     {/* Si l'utilisateur a une image de profil */}
                                     {message.sender?.image ? (

                                            <Image
                                                src={`${API_URL}${message.sender.image}`}
                                                alt={`${prenom} ${nom}`}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        
                                        ) : (
                                            /* Sinon, avatar avec initiales */
                                            <div
                                                className={`w-full h-full ${avatarColor} rounded-full flex items-center justify-center font-bold text-xs text-white`}
                                            >
                                                {initials.toUpperCase() || '??'}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div
                                    className={`p-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-lg ${
                                        isSent
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                            : receivedBubble
                                        } ${isSent ? '' : 'mr-4'}`
                                        }
                                >
                                    {/* Nom de l'expéditeur pour messages reçus */}
                                    {!isSent && message.sender && (
                                        <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            {message.sender.prenom} {message.sender.nom}
                                        </p>
                                    )}
                                    {/* GESTION DU FICHIER ATTACHÉ */}

                                    {message.fichier && (() => {
                                        const filenameOnly = message.fichier.split("/").pop()?.trim() || "";
                                        if (!filenameOnly) return null;

                                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(filenameOnly);

                                        return isImage ? (
                                            // Affichage direct de l'image
                                            <div
                                                className="w-40 h-40 rounded-lg mb-2 overflow-hidden cursor-pointer hover:opacity-90"
                                                style={{
                                                    backgroundImage: `url(${API_URL}/forum/filesdownload/${encodeURIComponent(filenameOnly)})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                                onClick={() => window.open(`${API_URL}/forum/filesdownload/${encodeURIComponent(filenameOnly)}`, "_blank")}
                                            />
                                        ) : (
                                            // Sinon, icône fichier
                                            <a
                                                href={`${API_URL}/forum/filesdownload/${encodeURIComponent(filenameOnly)}`}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center p-2 rounded-lg mb-2 transition duration-150 
                                                    ${isSent ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-gray-100 hover:bg-gray-200'} 
                                                    ${darkMode && !isSent ? 'bg-gray-600 hover:bg-gray-500' : ''}`}
                                            >
                                                <FileText className={`w-4 h-4 mr-2 ${isSent ? 'text-white' : 'text-indigo-600'}`} />
                                                <span className={`text-sm truncate ${isSent ? 'text-white' : 'text-gray-800'}`}>
                                                    {filenameOnly}
                                                </span>
                                            </a>
                                        )
                                    })()}

                                    {/* Contenu textuel */}
                                    {message.contenu && <p className="text-sm break-words">{message.contenu}</p>}

                                    <span className={`text-xs block mt-1 text-right ${isSent ? 'opacity-80' : subtleText}`}>
                                        {new Date(message.date_creation).toLocaleString([], {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>

                                </div>
                            </div>

                        );
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            <footer className={`p-4 border-t ${borderDefault} ${footerBg} shadow-inner`}>
                <div className="flex items-center">

                    {/* Bouton d'importation de fichier */}
                    <label
                        htmlFor="file-upload"
                        title="Attacher un fichier (sauf vidéo)"
                        className={`p-3 mr-3 ${subtleText} hover:text-indigo-600 hover:bg-gray-100 rounded-xl transition duration-150 cursor-pointer shrink-0 ${darkMode && 'hover:bg-gray-700'}`}
                    >
                        <Paperclip className="w-6 h-6 rotate-45" />
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain"
                        />
                    </label>

                    {/* Champ message + aperçu fichier */}
                    <div
                        className={`flex items-center p-3 rounded-full border ${borderDefault} ${inputInteractiveClasses} 
                transition mr-3 shadow-sm flex-1
                ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:border-purple-500 focus-within:border-purple-500
            `}
                    >
                        {/* Aperçu du fichier sélectionné */}
                        {selectedFile && (
                            <div className="flex items-center mr-3 px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-600">
                                <FileText className="w-4 h-4 mr-2" />
                                <span className="text-sm">{selectedFile.name}</span>
                                <button
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Champ de message */}
                        <input
                            type="text"
                            placeholder="Écrire un message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            disabled={!activeChatId || sendingMessage}
                            className={`flex-1 bg-transparent outline-none
                ${darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}
                sm:text-sm md:text-base
                `}
                        />
                    </div>

                    {/* Bouton Envoyer */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!activeChatId || (!messageInput.trim() && !selectedFile) || sendingMessage}
                        className="bg-indigo-600 text-white px-4 py-3 rounded-full hover:bg-indigo-700 transition duration-150 shadow-lg flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Envoyer"
                    >
                        {sendingMessage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span className="hidden sm:inline">Envoyer</span>
                            </>
                        )}
                    </button>
                </div>
            </footer>

        </div>
    )

    //  POPUP DE CONFIRMATION DE SUPPRESSION
    const DeleteConfirmationPopup = () => {
        if (!deleteSujet) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setDeleteSujet(null)}
                />

                <div
                    className={`relative w-[90%] max-w-sm p-6 rounded-xl shadow-2xl ${
                        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                        }`}
                >
                    <h2 className={`text-lg font-bold mb-4 text-center ${generalText}`}>
                        Confirmer la suppression
                    </h2>

                    <p className={`mb-6 text-center text-sm ${subtleText}`}>
                        Voulez-vous vraiment supprimer le sujet{" "}
                        <span className="font-semibold text-red-500 dark:text-red-400">{deleteSujet.titre}</span> ?
                        Cette action est irréversible et supprimera tous les messages associés.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setDeleteSujet(null)}
                            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                        >
                            Annuler
                        </button>

                        <button
                            onClick={() => confirmDelete(deleteSujet.idSujet)}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div
                className={`
                fixed
                /* Positionnement par rapport au Header et à la Sidebar */
                top-[72px]       /* Hauteur approximative de votre Header */
                left-0 md:left-64 /* 0 sur mobile, décalé de la largeur Sidebar sur PC */
                right-0
                bottom-0
                
                /* Style et Couleurs */
                ${containerBg} 
                shadow-2xl 
                z-40
                transition-all duration-300
                overflow-hidden
                flex flex-col
            `}
            >
                {/* Message d'erreur */}
                {error && (
                    <div className={`absolute top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-800'} flex items-center justify-between max-w-md`}>
                        <span className="text-sm">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-4 text-lg font-bold hover:opacity-70"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Contenu du Forum */}
                <div className="flex flex-row h-full w-full overflow-hidden">
                    {renderSidebar()}
                    {renderChatWindow()}
                </div>
            </div>

            {/* Popup de création de sujet (Reste centré sur tout l'écran) */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
                    <div className={`relative w-[95%] max-w-lg p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className={`text-xl font-bold mb-4 text-center ${generalText}`}>
                            {isEditMode ? 'Modifier le groupe' : 'Créer un nouveau groupe'}
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom du groupe"
                                value={newSujetTitre}
                                onChange={(e) => setNewSujetTitre(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${borderDefault} ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                            />

                            {/* Importer une image */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="flex items-center justify-center bg-[#19ff11] text-white p-3 rounded-lg shadow">
                                    <FileText size={20} />
                                </div>
                                <span className={darkMode ? "text-[#19ff11]" : "text-[#17f]"}>
                                    {newSujetImage
                                        ? newSujetImage.name
                                        : isEditMode && editSujet?.image
                                            ? `Remplacer l'image actuelle`
                                            : "Importer une image (optionnelle)"
                                    }
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewSujetImage(e.target.files[0]);
                                        }
                                    }}
                                />
                            </label>

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    onClick={() => {
                                        setShowCreatePopup(false);
                                        setEditSujet(null);
                                        setNewSujetTitre('');
                                        setNewSujetImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={isEditMode ? handleUpdateSujet : handleCreateSujet}
                                    disabled={!newSujetTitre.trim() || creatingSujet}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center"
                                >
                                    {creatingSujet ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        isEditMode ? 'Modifier' : 'Ajouter'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationPopup />
        </>
    );
}


