"use client";

import { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    LogOut,
    Send,
    ArrowLeft,
    X,
    Paperclip // <-- Import de l'icône d'attachement
} from 'lucide-react';

/**
 * Données simulées des contacts pour la barre latérale.
 */
const mockContacts = [
    { id: '1', name: 'Amélie Dubois', initials: 'AD', status: 'En ligne', message: "C'est la version finale ?", time: '1 min', unread: 0, avatarColor: 'bg-indigo-200' },
    { id: '2', name: 'Bruno Chatel', initials: 'BC', status: 'Hors ligne', message: "Merci, j'ai bien reçu.", time: '3h', unread: 3, avatarColor: 'bg-pink-200' },
    { id: '3', name: 'Équipe Qualité', initials: 'EQ', status: 'En ligne', message: "Rapport hebdomadaire disponible.", time: '1h', unread: 0, avatarColor: 'bg-yellow-200' },
    { id: '4', name: 'Sophie Martin', initials: 'SM', status: 'Hors ligne', message: "On se voit demain.", time: '1j', unread: 0, avatarColor: 'bg-green-200' },
];

/**
 * Données simulées des messages pour le chat actif.
 */
const mockMessages = [
    { type: 'received', text: "Bonjour ! J'ai bien intégré les modifications, ça rend beaucoup mieux avec le fond uniforme. Est-ce que ce layout est ce que vous aviez en tête ?", time: '09:45' },
    { type: 'sent', text: "Oui, c'est parfait ! L'harmonie des fonds est là et le compte dans le sidebar est très visible. Bravo pour l'intégration responsive.", time: '09:47' },
    { type: 'received', text: "Super ! On peut passer à la phase suivante maintenant. N'oubliez pas les tests sur mobile pour garantir la 'bonne vue'.", time: '09:50' },
    { type: 'sent', text: "Compris. Je m'en occupe tout de suite. Merci pour la réactivité !", time: '09:52' },
];

// Mise à jour de l'interface pour accepter darkMode
interface MessagePopupProps {
    onClose?: () => void;
    darkMode: boolean; // Ajout de la prop darkMode
}

// Mise à jour de l'export pour accepter la prop darkMode
export default function MessagePopup({ onClose, darkMode }: MessagePopupProps) {
    const [activeChatId, setActiveChatId] = useState(mockContacts[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const activeChat = mockContacts.find(c => c.id === activeChatId);
    
    // Logique d'upload (inchangée)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            alert(`Fichier sélectionné : ${file.name}. Il n'y a plus qu'à l'uploader !`);
            // Ici, vous ajouteriez la logique d'upload réelle (ex: API call)
        }
    };

    const handleContactClick = (id: string) => {
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
                    placeholder="Rechercher un contact..."
                    className={`w-full pl-10 p-2.5 text-sm rounded-xl border ${borderDefault} ${inputInteractiveClasses} transition shadow-sm ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                />
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${subtleText}`} />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                {mockContacts.map(contact => {
                    const isActive = contact.id === activeChatId;
                    return (
                        <div
                            key={contact.id}
                            onClick={() => handleContactClick(contact.id)}
                            className={`flex items-center p-3 text-sm rounded-xl shadow-sm cursor-pointer transition duration-150 ${
                                isActive
                                    ? 'font-semibold text-white bg-indigo-600 hover:bg-indigo-700'
                                    : contactDefault
                            }`}
                        >
                            <div className="relative w-10 h-10 mr-3 shrink-0">
                                <div className={`w-full h-full ${contact.avatarColor} rounded-full flex items-center justify-center font-semibold text-sm ${isActive ? 'text-white' : generalText}`}>{contact.initials}</div>
                                <OnlineDot isOnline={contact.status === 'En ligne'} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate">{contact.name}</p>
                                <p className={`text-xs ${isActive ? 'font-normal opacity-90' : subtleText} truncate`}>{contact.message}</p>
                            </div>
                            <div className="flex flex-col items-end ml-2 shrink-0">
                                {contact.unread > 0 && (
                                    <span className="text-xs w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white font-bold mb-1">
                                        {contact.unread}
                                    </span>
                                )}
                                <span className={`text-xs ${isActive ? 'opacity-90' : subtleText} block`}>{contact.time}</span>
                            </div>
                        </div>
                    );
                })}
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
                    <div className={`w-full h-full ${activeChat?.avatarColor} rounded-full flex items-center justify-center font-semibold ${generalText}`}>{activeChat?.initials}</div>
                    <OnlineDot isOnline={activeChat?.status === 'En ligne'} />
                </div>
                <div className="ml-4 overflow-hidden flex-1">
                    <h3 className={`text-lg font-semibold ${generalText} truncate`}>{activeChat?.name}</h3>
                    <p className={`text-xs ${activeChat?.status === 'En ligne' ? 'text-green-500' : subtleText}`}>{activeChat?.status}</p>
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
                {mockMessages.map((message, index) => (
                    // Conteneur du message
                    <div 
                        key={index} 
                        className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                        {/* Bulle de message - MODIFIÉE */}
                        <div 
                            className={`p-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md ${
                                message.type === 'sent'
                                    // Messages envoyés : grand arrondi, coin supérieur droit légèrement arrondi pour la flèche
                                    ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                                    : receivedBubble // Utilise la constante mise à jour
                            } ${message.type === 'received' ? 'ml-4' : ''}`} // Ajout d'une marge à gauche pour le message reçu pour l'esthétique
                        >
                            <p className="text-sm">{message.text}</p>
                            <span className={`text-xs block mt-1 text-right ${message.type === 'sent' ? 'opacity-80' : subtleText}`}>{message.time}</span>
                        </div>
                    </div>
                ))}
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
                        className={`flex-1 p-3 rounded-xl border ${borderDefault} ${inputInteractiveClasses} transition mr-3 shadow-sm ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                    />
                    
                    {/* Bouton Envoyer */}
                    <button
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition duration-150 shadow-lg flex items-center justify-center w-12 h-12 shrink-0"
                        title="Envoyer"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );

    return (
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
            <div className="flex flex-row h-full w-full overflow-hidden">
                {renderSidebar()}
                {renderChatWindow()}
            </div>
        </div>
    );
}
