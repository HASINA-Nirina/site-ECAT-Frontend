"use client";

import { useEffect, useState } from "react";
import MessagePopup from "@/app/admin/super/dashboard/Message/MessagePopup";
import { LayoutDashboard, BookOpen, CreditCard, Clock, Users, MessageCircle, } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie, Legend } from "recharts";

interface MainContentProps {
  readonly darkMode: boolean;
  readonly lang: string;
}

function rankToColors(values: number[]) {
  const palette = {
    highest: "#16a34a", // vert = plus grande valeur
    second: "#3b82f6", // bleu = valeur moyenne haute
    third: "#fbbf24", // jaune = moyenne
    lowest: "#ef4444", // rouge = faible
  };
  const pairs = values.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const colorsByIndex: string[] = new Array(values.length).fill(palette.lowest);
  if (pairs[0]) colorsByIndex[pairs[0].i] = palette.highest;
  if (pairs[1]) colorsByIndex[pairs[1].i] = palette.second;
  if (pairs[2]) colorsByIndex[pairs[2].i] = palette.third;
  return colorsByIndex;
}

// Tooltip personnalisé
const CustomTooltip = ({ active, payload, label, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-2 rounded-lg shadow-xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} border border-gray-300`}>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs">{`Valeur : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="font-bold text-xs" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function MainContent({ darkMode, lang }: MainContentProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Données étudiant
  const [formations, setFormations] = useState<number>(0);
  const [paiements, setPaiements] = useState<number>(0);
  const [livres, setLivres] = useState<number>(0);
  const [tempsActivite, setTempsActivite] = useState<number>(0); // en heures par exemple

  const [historique, setHistorique] = useState<{ mois: string; livres: number; heures: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        setFormations(data.formations ?? 0);
        setPaiements(data.paiements ?? 0);
        setLivres(data.livres ?? 0);
        setTempsActivite(data.temps_activite ?? 0);

        setHistorique(data.historique ?? []); // [{mois:'Jan', livres:2, heures:5},...]
      } catch (e) {
        console.warn("Erreur fetch étudiant:", e);
      }
    };
    fetchData();
  }, []);

  const statCardClass = `rounded-2xl shadow-xl transition-all p-6 border-l-4 border-[#17f] ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white" : "bg-gradient-to-br from-white to-gray-100 text-gray-900"}`;
  const chartCardClass = `rounded-2xl shadow-xl transition-all p-6 ${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white" : "bg-gradient-to-br from-white to-gray-100 text-gray-900"}`;

  const pieData = [
    { name: "Formations", value: formations },
    { name: "Paiements", value: paiements },
    { name: "Livres débloqués", value: livres },
    { name: "Temps activité", value: tempsActivite },
  ];

  const pieColors = rankToColors(pieData.map(d => d.value));

  const barColors = rankToColors(historique.map(h => h.livres + h.heures));

  return (
    <main className="flex-1 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={28} color="#17f" />
          <h1 className="text-2xl font-bold">{lang === "fr" ? "Tableau de bord - Étudiant" : "Student Dashboard"}</h1>
        </div>
        <div className="flex flex-col items-end bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Clock size={22} />
            <span className="text-xl font-semibold">{mounted && time ? time.toLocaleTimeString("fr-FR") : "--:--:--"}</span>
          </div>
          <span className="text-sm opacity-90">{mounted && time ? time.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : ""}</span>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <div className={statCardClass}>
          <div className="flex items-center gap-3 mb-2"><BookOpen size={22} color="#fbbf24" /><h3 className="font-semibold text-lg">Formations</h3></div>
          <h2 className="text-4xl font-extrabold text-yellow-400">{formations}</h2>
          <p className="text-sm opacity-75">Formations suivies</p>
        </div>
        <div className={statCardClass}>
          <div className="flex items-center gap-3 mb-2"><CreditCard size={22} color="#3b82f6" /><h3 className="font-semibold text-lg">Paiements</h3></div>
          <h2 className="text-4xl font-extrabold text-green-400">{paiements}</h2>
          <p className="text-sm opacity-75">Paiements validés</p>
        </div>
        <div className={statCardClass}>
          <div className="flex items-center gap-3 mb-2"><Users size={22} color="#16a34a" /><h3 className="font-semibold text-lg">Livres</h3></div>
          <h2 className="text-4xl font-extrabold text-blue-400">{livres}</h2>
          <p className="text-sm opacity-75">Livres débloqués</p>
        </div>
        <div className={statCardClass}>
          <div className="flex items-center gap-3 mb-2"><Clock size={22} color="#ef4444" /><h3 className="font-semibold text-lg">Activité</h3></div>
          <h2 className="text-4xl font-extrabold text-red-400">{tempsActivite}h</h2>
          <p className="text-sm opacity-75">Heures d&apos;activité</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Diagramme circulaire */}
        <div className={chartCardClass}>
          <h2 className="text-lg font-semibold mb-4 text-center">Répartition des activités</h2>
          <PieChart width={300} height={300}>
            <ReTooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={4} cornerRadius={10} startAngle={90} endAngle={-270} label={renderCustomLabel} labelLine={false}>
              {pieData.map((entry, index) => <Cell key={index} fill={pieColors[index]} />)}
            </Pie>
            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: "20px" }} formatter={v => <span className="text-sm font-medium opacity-90">{v}</span>} />
          </PieChart>
        </div>

        {/* Histogramme */}
        <div className={chartCardClass}>
          <h2 className="text-lg font-semibold mb-4 text-center">Historique mensuel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historique} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#222731" : "#e6eef8"} />
              <XAxis dataKey="mois" tick={{ fill: "#9aa4b2" }} />
              <YAxis tick={{ fill: "#9aa4b2" }} />
              <ReTooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="livres" radius={[10, 10, 0, 0]}>
                {historique.map((entry, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
              <Bar dataKey="heures" radius={[10, 10, 0, 0]}>
                {historique.map((entry, i) => <Cell key={`h-${i}`} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-xs opacity-75 text-center">Couleurs selon l&apos;importance des valeurs : vert = élevé, bleu/jaune = moyen, rouge = faible</p>
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
          onClose={() => setShowMessage(false)}
        />
      )}
    </main>
  );
}
