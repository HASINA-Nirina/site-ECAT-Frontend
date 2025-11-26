"use client";

import { useEffect, useState, useMemo } from "react";
// Le composant MessagePopup est retiré pour assurer la compilation dans l'environnement actuel.
// import MessagePopup from "./Message/MessagePopup"; 
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Clock,
  MessageCircle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Legend,
  Cell,
  Tooltip as ReTooltip,
  BarChart, // Importation nécessaire pour le diagramme à bandes
  Bar,      // Composant Bar pour les données du diagramme
  XAxis,    // Axe X
  YAxis,    // Axe Y
  CartesianGrid, // Grille de fond
  ResponsiveContainer // Conteneur réactif
} from "recharts";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

// --------------------------
// FONCTIONS D'AIDE ET COMPOSANTS GRAPHIQUES
// --------------------------

/**
 * Assigne une couleur basée sur le rang des valeurs.
 * Utilisé pour le Pie Chart (Actifs, En attente, Diplômés)
 */
function rankToColors(values: number[]) {
  const palette = {
    highest: "#16a34a", // Green (Vert - Plus élevé)
    second: "#fbbf24", // Yellow (Jaune - Deuxième)
    third: "#3b82f6", // Blue (Bleu - Troisième)
    // Pour cet usage, nous n'avons que trois catégories significatives.
  };

  const pairs = values.map((v, i) => ({ v, i }));
  pairs.sort((a, b) => b.v - a.v);

  const colorsByIndex: string[] = new Array(values.length).fill("#ef4444"); // Default Red

  // Assigner les couleurs aux indices d'origine
  if (pairs[0]) colorsByIndex[pairs[0].i] = palette.highest;
  if (pairs[1]) colorsByIndex[pairs[1].i] = palette.second;
  if (pairs[2]) colorsByIndex[pairs[2].i] = palette.third;

  return colorsByIndex;
}

/**
 * Assigne une couleur aux barres du Bar Chart en fonction de leur valeur
 * pour respecter les principes d'ergonomie (Vert=Haut, Jaune=Moyen, Bleu=Bas).
 */
function colorBars(data: { name: string, Inscrits: number }[]) {
  const values = data.map(d => d.Inscrits);
  const pairs = values.map((v, i) => ({ v, i }));
  // Trier par valeur décroissante pour déterminer le rang
  pairs.sort((a, b) => b.v - a.v);

  const colors = new Array(values.length).fill("#3b82f6"); // Couleur par défaut (Bleu Moyen)
  
  // Palette pour l'ergonomie
  const palette = {
    highest: "#16a34a", // Vert (Haut)
    second: "#fbbf24", // Jaune (Moyen/Bon)
    third: "#0f766e", // Bleu sarcelle (Acceptable)
  };

  // Assigner les couleurs aux TOP 3 en fonction du rang (indice d'origine)
  if (pairs[0]) colors[pairs[0].i] = palette.highest;
  if (pairs[1]) colors[pairs[1].i] = palette.second;
  if (pairs[2]) colors[pairs[2].i] = palette.third;
  
  return colors;
}


/**
 * Formate un montant en Ariary (Ar) avec des suffixes (k, M).
 */
function formatMoney(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M Ar`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k Ar`;
  return `${amount} Ar`;
}

// Custom Tooltip pour Recharts (pour le PieChart)
const CustomPieTooltip = ({ active, payload, darkMode }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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
        <p className="text-xs">{`Nombre : ${data.value}`}</p>
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

// --------------------------
// COMPOSANT PRINCIPAL
// --------------------------

export default function MainContent({ darkMode, lang }: MainContentProps) {
  // Remplacement de showMessage/MessagePopup par un simple état pour le message
  const [messageNotification, setMessageNotification] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Simulation des données spécifiques à l'antenne locale
  const statEtudiantsGeres = 120;
  const statPaiementsLocaux = 1_500_000; // En Ariary
  const statFormationsActives = 5;

  // Données du Pie Chart : Répartition des étudiants par statut
  const studentStatusData = useMemo(() => {
    // Statut : Actif, En attente de paiement, Diplômé
    const studentStatusValues = [75, 30, 15]; // Exemple de nombres
    const labels = ["Actifs", "En attente", "Diplômés"];

    const data = studentStatusValues.map((value, i) => ({
      name: labels[i],
      value,
    }));
    const colors = rankToColors(studentStatusValues);
    return { pieData: data, pieColors: colors };
  }, []); // Aucune dépendance ici, données simulées

  // Données pour le Bar Chart (Inscriptions Mensuelles)
  const monthlyEnrollmentData = useMemo(() => {
    const data = [
      { name: "Jan", Inscrits: 20 },
      { name: "Fév", Inscrits: 35 },
      { name: "Mar", Inscrits: 15 },
      { name: "Avr", Inscrits: 40 },
      { name: "Mai", Inscrits: 25 },
    ];
    const colors = colorBars(data);
    return { barData: data, barColors: colors };
  }, []);

  const { pieData, pieColors } = studentStatusData;
  const { barData, barColors } = monthlyEnrollmentData;


  // Initialisation de l'horloge
  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // NOUVELLE CLASSE POUR LES CARTES DE STATISTIQUES (Style Super Admin)
  const statCardClass = `rounded-2xl shadow-xl transition-all p-6 border-l-4 border-[#17f] ${
    darkMode
      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
  }`;
  
  // CLASSE POUR LES CARTES DE GRAPHIQUES (Style Super Admin)
  const chartCardClass = `rounded-2xl shadow-xl transition-all p-6 ${
    darkMode
      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
  }`;
  
  // Custom Tooltip pour le Bar Chart
  const CustomBarTooltip = ({ active, payload, label, darkMode }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 rounded-lg shadow-xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } border border-gray-300`}
        >
          <p className="text-sm font-semibold">{`Mois : ${label}`}</p>
          <p className="text-xs">{`Inscriptions : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="flex-1 p-6 relative">
      {/* === En-tête interne du dashboard avec horloge (Style Super Admin) === */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={28} color="#17f" />
          <h1
            className={`text-2xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {lang === "fr"
              ? "Tableau de bord - Admin Local"
              : "Local Admin Dashboard"}
          </h1>
        </div>

        {/* Bloc Horloge et Date */}
        <div className="flex flex-col items-end bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl px-4 py-3 shadow-lg hidden sm:flex">
          <div className="flex items-center gap-2">
            <Clock size={22} />
            <span className="text-xl font-semibold">
              {mounted && time
                ? time.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "--:--:--"}
            </span>
          </div>
          <span className="text-sm opacity-90">
            {mounted && time
              ? time.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </span>
        </div>
      </div>

      {/* === Grille principale (3 colonnes pour les stats + 1 pour le graphique) === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Colonne des cartes statistiques */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* CARTE 1: Étudiants gérés (Total) */}
            <div className={statCardClass}>
              <div className="flex items-center gap-3 mb-2">
                <Users size={22} color="#16a34a" />
                <h3 className="font-semibold text-lg">
                  {lang === "fr" ? "Étudiants Gérés" : "Managed Students"}
                </h3>
              </div>
              <h2 className="text-4xl font-extrabold text-blue-400">
                {statEtudiantsGeres}
              </h2>
              <p className="text-sm opacity-75">
                {lang === "fr" ? "Total inscrits sur cette antenne" : "Total enrolled in this branch"}
              </p>
            </div>

            {/* CARTE 2: Paiements reçus (Revenus Locaux) */}
            <div className={statCardClass}>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard size={22} color="#fbbf24" />
                <h3 className="font-semibold text-lg">
                {lang === "fr" ? "Revenus Locaux" : "Local Revenue"}
                </h3>
              </div>
              <h2 className="text-4xl font-extrabold text-green-400">
                {formatMoney(statPaiementsLocaux)}
              </h2>
              <p className="text-sm opacity-75">
              {lang === "fr" ? "Paiements validés (ce mois)" : "Validated payments (this month)"}
              </p>
            </div>
            
            {/* CARTE 3: Formations Actives (Ajouté) */}
            <div className={statCardClass}>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen size={22} color="#3b82f6" />
                <h3 className="font-semibold text-lg">
                  {lang === "fr" ? "Formations Actives" : "Active Programs"}
                </h3>
              </div>
              <h2 className="text-4xl font-extrabold text-yellow-400">
                {statFormationsActives}
              </h2>
              <p className="text-sm opacity-75">
              {lang === "fr" ? "Formations actuellement ouvertes" : "Currently open programs"}
              </p>
            </div>
          </div>
          
          {/* GRAPHIQUE 1: Bar Chart pour les Inscriptions par Mois (Exemple) */}
          <div className={chartCardClass}>
            <h2 className="text-lg font-semibold mb-4">
              {lang === "fr" ? "Inscriptions Mensuelles" : "Monthly Enrollment (Simulation)"}
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4b5563" : "#e5e7eb"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <ReTooltip content={<CustomBarTooltip darkMode={darkMode} />} />
                  {/* Bordure Radius appliquée ici : [8, 8, 0, 0] pour les coins supérieurs */}
                  <Bar dataKey="Inscrits" radius={[8, 8, 0, 0]}>
                    {
                      barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index]} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Colonne de droite: Pie Chart (Répartition des étudiants) */}
        <div className={chartCardClass}>
          <h2 className="text-lg font-semibold mb-4 text-center">
            {lang === "fr" ? "Statut des Étudiants" : "Student Status Overview"}
          </h2>

          <div className="w-full flex flex-col items-center justify-center pt-8">
            <PieChart width={300} height={320}>
              <ReTooltip content={<CustomPieTooltip darkMode={darkMode} />} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70} 
                outerRadius={120}
                paddingAngle={4}
                cornerRadius={10} 
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false} 
                label={renderCustomLabel} 
                labelLine={false} 
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
                formatter={(value) => (
                  <span className="text-sm font-medium opacity-90">{value}</span>
                )}
              />
            </PieChart>

            <div className="text-center mt-4">
              <div className="text-sm opacity-80">
              {lang === "fr" ? "Répartition des étudiants par statut dans cette antenne." : "Distribution of students by status in this branch."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Bouton messages (flottant) - Simplifié === */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl transition-transform transform hover:scale-110 group"
        title="Messages"
        onClick={() => setMessageNotification(true)} 
        onBlur={() => setTimeout(() => setMessageNotification(false), 500)} // Masquer après un court délai
      >
        <MessageCircle size={28} />
        {/* Simple bulle d'information pour remplacer le popup non résolu */}
        {messageNotification && (
          <div className="absolute bottom-full mb-2 w-48 p-2 text-xs rounded-lg shadow-md bg-yellow-400 text-gray-900 pointer-events-none opacity-100 transition-opacity duration-300">
            {lang === "fr" ? "Fonctionnalité de messagerie désactivée pour la compilation." : "Messaging feature disabled for compilation."}
          </div>
        )}
      </button>
    </main>
  );
}