"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Clock,
  MessageCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

// =================================================================
// COMPOSANT SIMULÉ: MessagePopup
// =================================================================
const MessagePopup = ({
  darkMode,
  adminName,
  onClose,
}: {
  darkMode: boolean;
  adminName: string;
  onClose: () => void;
}) => {
  const modalClass = `fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
    darkMode ? "bg-black/70" : "bg-black/50"
  }`;
  const cardClass = `rounded-2xl shadow-2xl p-6 w-full max-w-sm transition-all duration-300 transform scale-100 ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  // Empêche la fermeture du modal si on clique sur le contenu du modal
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={modalClass} onClick={onClose}>
      <div className={cardClass} onClick={handleCardClick}>
        <h3 className="text-xl font-bold mb-4 flex justify-between items-center">
          Messages
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </h3>
        <p className="text-sm opacity-80 mb-4">
          Bonjour {adminName}. Ceci est une fenêtre de message simulée.
        </p>
        <p className="text-xs opacity-60">
          (Le contenu réel des messages du système Ecat irait ici.)
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

/**
 * Assigne une couleur basée sur le rang des valeurs (plus élevé = vert).
 * @param values Tableau de valeurs numériques.
 * @returns Tableau de couleurs correspondant à chaque index.
 */
function rankToColors(values: number[]) {
  const palette = {
    highest: "#16a34a", // Green (Vert)
    second: "#fbbf24", // Yellow (Jaune)
    third: "#3b82f6", // Blue (Bleu)
    lowest: "#ef4444", // Red (Rouge)
  };

  const pairs = values.map((v, i) => ({ v, i }));
  // Trier par valeur décroissante
  pairs.sort((a, b) => b.v - a.v);

  const colorsByIndex: string[] = new Array(values.length).fill(palette.lowest);

  // Assigner les couleurs aux indices d'origine
  if (pairs[0]) colorsByIndex[pairs[0].i] = palette.highest;
  if (pairs[1]) colorsByIndex[pairs[1].i] = palette.second;
  if (pairs[2]) colorsByIndex[pairs[2].i] = palette.third;
  // Si plus d'éléments, ils restent lowest (red)

  return colorsByIndex;
}

/**
 * Formate un montant en Ariary (Ar) avec des suffixes (k, M).
 * @param amount Montant numérique.
 * @returns Chaîne de caractères formatée.
 */
function formatMoney(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M Ar`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k Ar`;
  return `${amount} Ar`;
}

// Custom Tooltip pour Recharts (pour le BarChart)
const CustomBarTooltip = ({ active, payload, label, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-2 rounded-lg shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } border border-gray-300`}
      >
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs">{`Inscrits : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip pour Recharts (pour le PieChart)
const CustomPieTooltip = ({ active, payload, darkMode }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Pourcentage calculé manuellement car il n'est pas directement dans payload
    const total = payload.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0
    );
    const percent = total > 0 ? (data.value / total) * 100 : 0;

    return (
      <div
        className={`p-2 rounded-lg shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } border border-gray-300`}
      >
        <p className="text-sm font-semibold">{data.name}</p>
        <p className="text-xs">{`Valeur : ${data.value}`}</p>
        <p className="text-xs">{`Pourcentage : ${percent.toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom Label pour afficher le pourcentage directement sur la tranche Doughnut
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-bold text-xs"
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // NOUVELLE CLASSE POUR LES CARTES DE STATISTIQUES AVEC BORDURE GAUCHE EN #17f
  const statCardClass = `rounded-2xl shadow-xl transition-all p-6 border-l-4 border-[#17f] ${
    darkMode
      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
  }`;
  
  // CLASSE POUR LES CARTES DE GRAPHIQUES SANS BORDURE GAUCHE
  const chartCardClass = `rounded-2xl shadow-xl transition-all p-6 ${
    darkMode
      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
  }`;

  // --------------------------
  // Données
  // --------------------------
  const statEtudiants = 40;
  const statFormations = 20;
  const statAdmins = 8;
  const statPaiements = 3500000;

  // Utilisation de useMemo pour s'assurer que les données du PieChart ne changent que si les stats changent
  const { pieData, pieColors } = useMemo(() => {
    // DONNÉES DU DIAGRAMME CIRCULAIRE (Excluant les Paiements)
    const pieLabels = [
      "Étudiants inscrits",
      "Formations créées",
      "Antennes/Admins actifs",
    ];
    const pieValues = [statEtudiants, statFormations, statAdmins];
    const data = pieValues.map((value, i) => ({ name: pieLabels[i], value }));
    const colors = rankToColors(pieValues);
    return { pieData: data, pieColors: colors };
  }, [statEtudiants, statFormations, statAdmins]); // Dépendances claires

  // --------------------------
  // Histogramme (inscriptions par antenne)
  // --------------------------
  const inscriptionData = [
    { antenne: "Antananarivo", inscrits: 245 },
    { antenne: "Fianarantsoa", inscrits: 180 },
    { antenne: "Toamasina", inscrits: 130 },
    { antenne: "Toliara", inscrits: 75 },
  ];
  const barColors = rankToColors(inscriptionData.map((d) => d.inscrits));

  return (
    <main className="flex-1 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={28} color="#17f" />
          <h1 className="text-2xl font-bold">
            {lang === "fr"
              ? "Tableau de bord - Admin Super"
              : "Super Admin Dashboard"}
          </h1>
        </div>

        <div className="flex flex-col items-end bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Clock size={22} />
            <span className="text-xl font-semibold">
              {time.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <span className="text-sm opacity-90">
            {time.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column (cards + bar chart) */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          {/* Top stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* CARTE ÉTUDIANTS - UTILISE statCardClass avec bordure #17f */}
            <div className={statCardClass}>
              <div className="flex items-center gap-3 mb-2">
                <Users size={22} color="#16a34a" />
                <h3 className="font-semibold text-lg">Étudiants</h3>
              </div>
              <h2 className="text-4xl font-extrabold text-blue-400">
                {statEtudiants}
              </h2>
              <p className="text-sm opacity-75">
                Inscrits sur toutes les antennes
              </p>
            </div>

            {/* CARTE FORMATIONS - UTILISE statCardClass avec bordure #17f */}
            <div className={statCardClass}>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen size={22} color="#fbbf24" />
                <h3 className="font-semibold text-lg">Formations</h3>
              </div>
              <h2 className="text-4xl font-extrabold text-yellow-400">
                {statFormations}
              </h2>
              <p className="text-sm opacity-75">Actives actuellement</p>
            </div>

            {/* CARTE REVENUS - UTILISE statCardClass avec bordure #17f */}
            <div className={statCardClass}>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard size={22} color="#3b82f6" />
                <h3 className="font-semibold text-lg">Revenus</h3>
              </div>
              <h2 className="text-4xl font-extrabold text-green-400">
                {formatMoney(statPaiements)}
              </h2>
              <p className="text-sm opacity-75">Paiements validés</p>
            </div>
          </div>

          {/* Bar chart - UTILISE chartCardClass */}
          <div className={chartCardClass}>
            <h2 className="text-lg font-semibold mb-4">
              Inscriptions par antenne
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={inscriptionData} barSize={40}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#222731" : "#e6eef8"}
                  />
                  <XAxis dataKey="antenne" tick={{ fill: "#9aa4b2" }} />
                  <YAxis tick={{ fill: "#9aa4b2" }} />
                  <ReTooltip
                    content={<CustomBarTooltip darkMode={darkMode} />}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="inscrits" radius={[10, 10, 0, 0]}>
                    {inscriptionData.map((entry, i) => (
                      <Cell key={i} fill={barColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs opacity-75">
              Couleurs par rang : vert = le plus élevé, rouge = le plus bas
            </p>
          </div>
        </div>

        {/* Right column: Pie Chart (Vue d’ensemble du système ECAT) - UTILISE chartCardClass */}
        <div className={chartCardClass}>
          <h2 className="text-lg font-semibold mb-4 text-center">
            Vue d’ensemble du système ECAT
          </h2>

          {/* FIX: Le PieChart a maintenant des dimensions fixes et n'est plus dans ResponsiveContainer 
                pour éviter le clignotement des labels de pourcentage. */}
          <div className="w-full flex flex-col items-center justify-center mt-26">
            <PieChart width={300} height={300}>
              <ReTooltip content={<CustomPieTooltip darkMode={darkMode} />} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70} // Forme Doughnut (effet 3D)
                outerRadius={120}
                paddingAngle={4}
                cornerRadius={10} // Coins arrondis pour un effet visuel moderne
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false} // Désactive l'animation pour plus de stabilité
                label={renderCustomLabel} // Affiche seulement le pourcentage
                labelLine={false} // Cache les lignes de connexion
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                // Formatte la légende pour qu'elle soit claire
                formatter={(value) => (
                  <span className="text-sm font-medium opacity-90">{value}</span>
                )}
              />
            </PieChart>

            <div className="text-center mt-4">
              <div className="text-sm opacity-80">
                Répartition des indicateurs d'activité du système Ecat.
              </div>
            </div>
          </div>
        </div>
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
          adminName="Super Admin"
          onClose={() => setShowMessage(false)}
        />
      )}
    </main>
  );
}