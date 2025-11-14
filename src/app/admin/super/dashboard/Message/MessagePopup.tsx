"use client";

import { useState, useEffect, useRef } from 'react';
import {
    MessageSquare,
    Search,
    LogOut,
    Send,
    ArrowLeft,
    X,
    Paperclip,
    Plus,
    Loader2,
    FileText
} from 'lucide-react';

// Types pour les données du backend
interface Sujet {
    idSujet: number;
    titre: string;
    idCreateur: number;
    date_creation: string;
    image: string | null;
    messages?: Message[];
}

interface Message {
    idMessage: number;
    idSender: number;
    contenu: string;
    date_creation: string;
    idParentMessage?: number | null;
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

// Fonction utilitaire pour formater l'heure
const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// Mise à jour de l'export pour accepter la prop darkMode
export default function MessagePopup({ onClose, darkMode }: MessagePopupProps) {
    const [sujets, setSujets] = useState<Sujet[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loadingSujets, setLoadingSujets] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
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

    // Récupérer les sujets 
    const fetchSujets = async () => {
        const idUser = localStorage.getItem("idUser");
        try {
            setLoadingSujets(true);
            setError(null);
            const url = `${API_URL}/forum/ReadSujet/${idUser}`;
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
            if (data.length > 0 && !activeChatId) {
                setActiveChatId(data[0].idSujet);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(`Impossible de charger les sujets: ${errorMessage}`);
            alert(' Erreur fetch sujets:' +err);
        } finally {
            setLoadingSujets(false);
        }
    };

    // Récupérer les messages d'un sujet
    const fetchMessages = async (idSujet: number) => {
        try {
            setLoadingMessages(true);
            setError(null);
            const response = await fetch(`${API_URL}/forum/${idSujet}`, {
                credentials: "include",
            });
            if (!response.ok) throw new Error('Erreur chargement messages');
            const data = await response.json();
            setMessages(data.messages || []); 
        } catch (err) {
            setError('Impossible de charger les messages');
            console.error('Erreur fetch messages:', err);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Envoyer un message
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChatId || !idUser || sendingMessage) return;

        try {
            setSendingMessage(true);
            setError(null);
            const response = await fetch(`${API_URL}/forum/ajouter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    idSender: parseInt(idUser),
                    idSujet: activeChatId,
                    contenu: messageInput.trim(),
                    idParentMessage: null
                })
            });

            if (!response.ok) throw new Error('Erreur envoi message');
            
            setMessageInput('');
            // Recharger les messages
            await fetchMessages(activeChatId);
        } catch (err) {
            setError('Impossible d\'envoyer le message');
            console.error('Erreur send message:', err);
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

    // Charger les sujets au montage et quand idUser change
    useEffect(() => {
        const idUser = localStorage.getItem("idUser");
        alert(' useEffect - idUser:'+ idUser);
        if (idUser) {
            console.log(' idUser trouvé, chargement des sujets...');
            fetchSujets();
        } else {
            console.warn('idUser est null dans localStorage');
        }
    }, [idUser]);

    // Charger les messages quand un sujet est sélectionné
    useEffect(() => {
        if (activeChatId) {
            fetchMessages(activeChatId);
        }
    }, [activeChatId]);

    // Scroll vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        if (messagesEndRef.current && activeChatId) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [messages, activeChatId]);
      
    // Logique d'upload de fichier pour les messages (pour l'instant juste un placeholder)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            alert(`Fichier sélectionné : ${file.name}. Fonctionnalité à implémenter !`);
        }
    };

    const handleSujetClick = (id: number) => {
        setActiveChatId(id);
        if (window.innerWidth < 1024) setIsSidebarOpen(false); 
    };

    const OnlineDot = ({ isOnline }: { isOnline: boolean }) => (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
    );

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
                                onClick={() => handleSujetClick(sujet.idSujet)}
                            className={`flex items-center p-3 text-sm rounded-xl shadow-sm cursor-pointer transition duration-150 ${
                                isActive
                                    ? 'font-semibold text-white bg-indigo-600 hover:bg-indigo-700'
                                    : contactDefault
                            }`}
                        >
                            <div className="relative w-10 h-10 mr-3 shrink-0">
                                    {sujet.image ? (
                                        <img
                                            src={`${API_URL}/upload/forum/${sujet.image}`}
                                            alt={sujet.titre}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                    <div className={`w-full h-full ${avatarColor} rounded-full flex items-center justify-center font-semibold text-sm ${isActive ? 'text-white' : generalText}`}>
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                    <p className="truncate">{sujet.titre}</p>
                                    {lastMessage && (
                                        <p className={`text-xs ${isActive ? 'font-normal opacity-90' : subtleText} truncate`}>
                                            {lastMessage.contenu}
                                        </p>
                                    )}
                            </div>
                            <div className="flex flex-col items-end ml-2 shrink-0">
                                    <span className={`text-xs ${isActive ? 'opacity-90' : subtleText} block`}>{timeDisplay}</span>
                            </div>
                        </div>
                    );
                    })
                )}
                
                {/* Bouton pour créer un nouveau sujet */}
                <button
                    onClick={() => setShowCreatePopup(true)}
                    className={`w-full flex items-center justify-center p-3 rounded-xl shadow-sm transition duration-150 border-2 border-dashed ${borderDefault} hover:border-indigo-500 hover:bg-indigo-50 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                    title="Créer un nouveau sujet"
                >
                    <Plus className={`w-5 h-5 ${subtleText} mr-2`} />
                    <span className={`text-sm font-medium ${subtleText}`}>Nouveau sujet</span>
                </button>
            </div>

            <div className={`mt-auto pt-4 border-t ${borderDefault}`}>
                <div className={`flex items-center p-3 rounded-xl shadow-lg border ${borderDefault} transition duration-150 hover:shadow-xl cursor-pointer ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"}`}>
                    <div className="relative w-10 h-10 shrink-0">
                        <div className="w-full h-full bg-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg">J</div>
                        <OnlineDot isOnline={true} />
                    </div>

                    <div className="ml-3 leading-tight overflow-hidden flex-1 min-w-0">
                        <p className={`text-sm font-bold ${generalText} truncate`}>Jean L&apos;Utilisateur</p>
                        <p className="text-xs text-green-500 truncate">Connecté</p>
                    </div>

                    <button
                        onClick={onClose}
                        title="Déconnexion"
                        className={`ml-2 p-1.5 ${subtleText} hover:text-red-500 hover:bg-gray-100 rounded-full transition duration-150 shrink-0 ${darkMode && 'hover:bg-gray-700'}`}
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
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

                <div className="relative w-10 h-10 shrink-0">
                    {activeChat?.image ? (
                        <img
                            src={`${API_URL}/upload/forum/${activeChat.image}`}
                            alt={activeChat.titre}
                            className="w-full h-full rounded-full object-cover"
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className={`text-center py-8 ${subtleText} text-sm`}>
                        Aucun message pour le moment. Soyez le premier à écrire !
                    </div>
                ) : (
                    messages.map((message) => {
                        const isSent = message.idSender.toString() === idUser;
                        return (
                            <div 
                                key={message.idMessage} 
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                            >
                        <div 
                            className={`p-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md ${
                                        isSent
                                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                                            : receivedBubble
                                    } ${!isSent ? 'ml-4' : ''}`}
                                >
                                    <p className="text-sm">{message.contenu}</p>
                                    <span className={`text-xs block mt-1 text-right ${isSent ? 'opacity-80' : subtleText}`}>
                                        {formatTime(message.date_creation)}
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
                            // Permet tous les fichiers sauf les vidéos
                            accept="image/*, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain"
                        />
                    </label>

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
                        className={`flex-1 p-3 rounded-xl border ${borderDefault} ${inputInteractiveClasses} transition mr-3 shadow-sm ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"} disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    
                    {/* Bouton Envoyer */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!activeChatId || !messageInput.trim() || sendingMessage}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition duration-150 shadow-lg flex items-center justify-center w-12 h-12 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Envoyer"
                    >
                        {sendingMessage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                        <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );

    return (
        <>
        <div
            className={`
                absolute
                top-0 left-0 right-0 
                w-full h-full 
                ${containerBg} shadow-2xl 
                border-none
                overflow-hidden 
                z-40
                transition-all duration-300
                md:rounded-2xl
                md:border md:border-gray-700
                bottom-0 
                transform -translate-y-1 
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

            <div className="flex flex-row h-full w-full overflow-hidden">
                {renderSidebar()}
                {renderChatWindow()}
            </div>
        </div>

            {/* Popup de création de sujet  */}
            {showCreatePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className={`relative w-[95%] max-w-lg p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className={`text-xl font-bold mb-4 text-center ${generalText}`}>Créer un nouveau sujet</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Titre du sujet *"
                                value={newSujetTitre}
                                onChange={(e) => setNewSujetTitre(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${borderDefault} ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                            />

                            {/* Importer une image  */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow">
                                    <FileText size={20} />
                                </div>
                                <span className={darkMode ? "text-green-400" : "text-[#17f]"}>
                                    {newSujetImage ? newSujetImage.name : "Importer une image (optionnelle)"}
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
                                        setNewSujetTitre('');
                                        setNewSujetImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="px-5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleCreateSujet}
                                    disabled={!newSujetTitre.trim() || creatingSujet}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {creatingSujet ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Création...
                                        </>
                                    ) : (
                                        'Ajouter'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}