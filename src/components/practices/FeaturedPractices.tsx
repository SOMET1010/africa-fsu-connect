import { Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { PracticeCardVisual } from "./PracticeCardVisual";
import { AfricanDivider, AfricanStatNumber } from "@/components/shared/AfricanPattern";
import type { Practice } from "@/types/practice";

const featuredPractices: Practice[] = [
  {
    title: "Connectivité rurale par satellite en zones isolées",
    description: "150 villages enfin connectés malgré l'isolement géographique. Une révolution pour l'accès aux services numériques.",
    impact: { value: "150", label: "villages connectés" },
    agency: "Agence FSU Côte d'Ivoire",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    theme: "Connectivité",
    date: "Déc 2025",
    cover_image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=500&fit=crop",
  },
  {
    title: "Télémédecine villageoise intégrée",
    description: "Des consultations spécialisées accessibles partout, réduisant les délais de diagnostic de 70%.",
    impact: { value: "80", label: "centres de santé reliés" },
    agency: "Agence de l'Informatique de l'État du Sénégal",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    theme: "E-Santé",
    date: "Nov 2025",
    cover_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop",
  },
];

// Stats for the section
const stats = [
  { value: "100+", label: "Pratiques documentées" },
  { value: "23", label: "Pays participants" },
  { value: "5M+", label: "Bénéficiaires" },
];

export function FeaturedPractices() {
  return (
    <section>
      {/* Section header with stats */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">
              À la une
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Pratiques inspirantes ce mois-ci
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Des projets qui transforment le quotidien des populations africaines.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-8"
        >
          {stats.map((stat, index) => (
            <AfricanStatNumber
              key={stat.label}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </motion.div>
      </div>

      <AfricanDivider variant="subtle" className="mb-8" />
      
      {/* Featured cards grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {featuredPractices.map((practice, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PracticeCardVisual 
              {...practice} 
              variant="featured"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
