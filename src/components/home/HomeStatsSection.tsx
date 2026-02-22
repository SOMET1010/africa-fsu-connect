import { BarChart3, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

const GROWTH_DATA = [
  { month: "Jan", value: 32 },
  { month: "Fév", value: 35 },
  { month: "Mar", value: 38 },
  { month: "Avr", value: 40 },
  { month: "Mai", value: 42 },
  { month: "Jun", value: 45 },
  { month: "Jul", value: 47 },
  { month: "Aoû", value: 49 },
  { month: "Sep", value: 51 },
  { month: "Oct", value: 52 },
  { month: "Nov", value: 53 },
  { month: "Déc", value: 54 },
];

const DOMAIN_DATA = [
  { name: "Connectivité rurale", value: 35, color: "#3B82F6" },
  { name: "Éducation numérique", value: 25, color: "#10B981" },
  { name: "Télémédecine", value: 20, color: "#F59E0B" },
  { name: "E-Gouvernement", value: 15, color: "#8B5CF6" },
  { name: "Autre", value: 5, color: "#9CA3AF" },
];

const IMPACT_STATS = [
  { label: "Bénéficiaires directs", value: 2400000, suffix: "", prefix: "" },
  { label: "Villages connectés", value: 1847, suffix: "", prefix: "" },
  { label: "Budget mobilisé (M$)", value: 340, suffix: "M$", prefix: "" },
  { label: "Emplois créés", value: 12500, suffix: "", prefix: "" },
];

export function HomeStatsSection() {
  return (
    <section className="bg-gray-50/50 py-10 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-900">Statistiques 2024</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Growth chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Croissance du Réseau</h3>
            <p className="text-[11px] text-gray-400 mb-4">Nombre de pays membres actifs</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GROWTH_DATA}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[30, 56]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Domain donut */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Projets par Domaine</h3>
            <p className="text-[11px] text-gray-400 mb-4">Répartition des projets actifs</p>
            <div className="flex items-center gap-4">
              <div className="h-36 w-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={DOMAIN_DATA} innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={2} stroke="#fff">
                      {DOMAIN_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {DOMAIN_DATA.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[11px] text-gray-600">{d.name}</span>
                    <span className="text-[11px] font-semibold text-gray-800 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Impact numbers */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Impact</h3>
            <p className="text-[11px] text-gray-400 mb-4">Chiffres clés cumulés</p>
            <div className="grid grid-cols-2 gap-4">
              {IMPACT_STATS.map((stat, i) => (
                <div key={i} className="text-center py-3 rounded-lg bg-gray-50 border border-gray-100">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-xl font-bold text-gray-900" />
                  <p className="text-[10px] text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
