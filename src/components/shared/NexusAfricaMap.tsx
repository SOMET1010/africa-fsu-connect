import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface NexusAfricaMapProps {
  className?: string;
  animated?: boolean;
}

// ============================================================================
// HOOK: useMouseTilt - Effet de survol 3D fluide
// ============================================================================
function useMouseTilt(enabled: boolean, stiffness = 150, damping = 20) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Lissage des mouvements pour éviter l'effet "robotique"
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness, damping });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness, damping });

  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalisation de la position de la souris entre -0.5 et 0.5
      x.set(event.clientX / window.innerWidth - 0.5);
      y.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, x, y]);

  return { rotateX, rotateY };
}

// ============================================================================
// DATA: Nodes et connexions du réseau africain
// ============================================================================

// Points représentant les 54 pays africains (positions approximatives sur une grille normalisée 0-100)
const countryNodes = [
  // Afrique du Nord
  { id: 1, x: 35, y: 12, region: "north" },   // Maroc
  { id: 2, x: 42, y: 10, region: "north" },   // Algérie
  { id: 3, x: 50, y: 12, region: "north" },   // Tunisie
  { id: 4, x: 58, y: 14, region: "north" },   // Libye
  { id: 5, x: 68, y: 18, region: "north" },   // Égypte
  // Afrique de l'Ouest
  { id: 6, x: 22, y: 28, region: "west" },    // Mauritanie
  { id: 7, x: 18, y: 35, region: "west" },    // Sénégal
  { id: 8, x: 20, y: 38, region: "west" },    // Gambie
  { id: 9, x: 18, y: 42, region: "west" },    // Guinée-Bissau
  { id: 10, x: 22, y: 42, region: "west" },   // Guinée
  { id: 11, x: 20, y: 48, region: "west" },   // Sierra Leone
  { id: 12, x: 22, y: 52, region: "west" },   // Liberia
  { id: 13, x: 28, y: 32, region: "west" },   // Mali
  { id: 14, x: 32, y: 38, region: "west" },   // Burkina Faso
  { id: 15, x: 28, y: 48, region: "west" },   // Côte d'Ivoire
  { id: 16, x: 34, y: 48, region: "west" },   // Ghana
  { id: 17, x: 38, y: 46, region: "west" },   // Togo
  { id: 18, x: 40, y: 46, region: "west" },   // Bénin
  { id: 19, x: 44, y: 42, region: "west" },   // Niger
  { id: 20, x: 46, y: 48, region: "west" },   // Nigeria
  { id: 21, x: 15, y: 35, region: "west" },   // Cap-Vert (décalé)
  // Afrique Centrale
  { id: 22, x: 50, y: 38, region: "central" }, // Tchad
  { id: 23, x: 50, y: 50, region: "central" }, // Cameroun
  { id: 24, x: 46, y: 54, region: "central" }, // Guinée équatoriale
  { id: 25, x: 48, y: 58, region: "central" }, // Gabon
  { id: 26, x: 54, y: 56, region: "central" }, // Congo
  { id: 27, x: 58, y: 50, region: "central" }, // RCA
  { id: 28, x: 60, y: 60, region: "central" }, // RDC
  { id: 29, x: 44, y: 56, region: "central" }, // São Tomé
  // Afrique de l'Est
  { id: 30, x: 72, y: 24, region: "east" },   // Soudan
  { id: 31, x: 78, y: 28, region: "east" },   // Érythrée
  { id: 32, x: 82, y: 36, region: "east" },   // Djibouti
  { id: 33, x: 76, y: 38, region: "east" },   // Éthiopie
  { id: 34, x: 84, y: 42, region: "east" },   // Somalie
  { id: 35, x: 68, y: 52, region: "east" },   // Ouganda
  { id: 36, x: 74, y: 54, region: "east" },   // Kenya
  { id: 37, x: 68, y: 60, region: "east" },   // Rwanda
  { id: 38, x: 68, y: 64, region: "east" },   // Burundi
  { id: 39, x: 74, y: 62, region: "east" },   // Tanzanie
  { id: 40, x: 66, y: 40, region: "east" },   // Soudan du Sud
  // Afrique Australe
  { id: 41, x: 62, y: 72, region: "south" },  // Zambie
  { id: 42, x: 68, y: 78, region: "south" },  // Malawi
  { id: 43, x: 74, y: 76, region: "south" },  // Mozambique
  { id: 44, x: 78, y: 68, region: "south" },  // Comores
  { id: 45, x: 82, y: 78, region: "south" },  // Madagascar
  { id: 46, x: 86, y: 74, region: "south" },  // Maurice
  { id: 47, x: 88, y: 78, region: "south" },  // Seychelles
  { id: 48, x: 56, y: 78, region: "south" },  // Zimbabwe
  { id: 49, x: 52, y: 82, region: "south" },  // Botswana
  { id: 50, x: 48, y: 78, region: "south" },  // Namibie
  { id: 51, x: 56, y: 68, region: "south" },  // Angola
  { id: 52, x: 60, y: 88, region: "south" },  // Afrique du Sud
  { id: 53, x: 56, y: 90, region: "south" },  // Lesotho
  { id: 54, x: 62, y: 86, region: "south" },  // Eswatini
];

// Connexions principales entre régions (lignes de réseau)
const connections = [
  // Nord-Sud backbone
  { from: 5, to: 30 },   // Égypte → Soudan
  { from: 30, to: 33 },  // Soudan → Éthiopie
  { from: 33, to: 36 },  // Éthiopie → Kenya
  { from: 36, to: 39 },  // Kenya → Tanzanie
  { from: 39, to: 41 },  // Tanzanie → Zambie
  { from: 41, to: 52 },  // Zambie → Afrique du Sud
  // Ouest-Est connections
  { from: 13, to: 22 },  // Mali → Tchad
  { from: 22, to: 30 },  // Tchad → Soudan
  { from: 20, to: 23 },  // Nigeria → Cameroun
  { from: 23, to: 27 },  // Cameroun → RCA
  { from: 27, to: 28 },  // RCA → RDC
  { from: 28, to: 35 },  // RDC → Ouganda
  // Ouest backbone
  { from: 7, to: 13 },   // Sénégal → Mali
  { from: 13, to: 14 },  // Mali → Burkina
  { from: 14, to: 19 },  // Burkina → Niger
  { from: 19, to: 20 },  // Niger → Nigeria
  { from: 15, to: 16 },  // Côte d'Ivoire → Ghana
  { from: 16, to: 17 },  // Ghana → Togo
  // Centre backbone
  { from: 26, to: 28 },  // Congo → RDC
  { from: 28, to: 41 },  // RDC → Zambie
  { from: 51, to: 28 },  // Angola → RDC
  // Nord backbone
  { from: 1, to: 2 },    // Maroc → Algérie
  { from: 2, to: 3 },    // Algérie → Tunisie
  { from: 3, to: 4 },    // Tunisie → Libye
  { from: 4, to: 5 },    // Libye → Égypte
  // Sud backbone
  { from: 52, to: 49 },  // Afrique du Sud → Botswana
  { from: 49, to: 50 },  // Botswana → Namibie
  { from: 50, to: 51 },  // Namibie → Angola
  { from: 52, to: 43 },  // Afrique du Sud → Mozambique
  { from: 43, to: 42 },  // Mozambique → Malawi
];

// IDs des hubs principaux (pour effet radar)
const MAIN_HUB_IDS = [5, 7, 20, 28, 33, 36, 52]; // Égypte, Sénégal, Nigeria, RDC, Éthiopie, Kenya, Afrique du Sud

// ============================================================================
// COMPONENT: NexusAfricaMap
// ============================================================================

export function NexusAfricaMap({ className, animated = true }: NexusAfricaMapProps) {
  // Vérification de prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  
  const shouldAnimate = animated && !prefersReducedMotion;
  const { rotateX, rotateY } = useMouseTilt(shouldAnimate);

  // Variantes pour l'animation d'entrée
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.85, rotateZ: -3 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateZ: 0,
      transition: { duration: 1.2, ease: "easeOut" as const }
    }
  };

  const lineVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.5,
      transition: {
        pathLength: { delay: i * 0.04, duration: 0.8, ease: "easeInOut" as const },
        opacity: { delay: i * 0.04, duration: 0.3 }
      }
    })
  };

  return (
    <div 
      className={cn("absolute inset-0 flex items-center justify-center", className)}
      style={{ perspective: 1000 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-[800px] max-h-[800px]"
        preserveAspectRatio="xMidYMid meet"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          rotateX: shouldAnimate ? rotateX : 0, 
          rotateY: shouldAnimate ? rotateY : 0,
          transformStyle: "preserve-3d"
        }}
      >
        <defs>
          {/* Gradient pour les lignes de base */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--nx-network))" stopOpacity="0.4" />
            <stop offset="50%" stopColor="hsl(var(--nx-cyan))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--nx-network))" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Gradient pour le flux de données (paquet lumineux) */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--nx-gold))" stopOpacity="0" />
            <stop offset="40%" stopColor="hsl(var(--nx-gold))" stopOpacity="1" />
            <stop offset="60%" stopColor="hsl(var(--nx-gold))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--nx-gold))" stopOpacity="0" />
          </linearGradient>
          
          {/* Glow effect pour les nœuds */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Glow fort pour les nœuds principaux */}
          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow pour les flux de données */}
          <filter id="flowGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feFlood floodColor="hsl(var(--nx-gold))" floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== LAYER 1: Lignes de connexion de base ===== */}
        <g className="connections-base">
          {connections.map((conn, index) => {
            const fromNode = countryNodes.find(n => n.id === conn.from);
            const toNode = countryNodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.line
                key={`base-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#lineGradient)"
                strokeWidth="0.25"
                strokeLinecap="round"
                custom={index}
                variants={lineVariant}
                initial="hidden"
                animate="visible"
              />
            );
          })}
        </g>

        {/* ===== LAYER 2: Flux de données animés ===== */}
        {shouldAnimate && (
          <g className="connections-flow">
            {connections.map((conn, index) => {
              const fromNode = countryNodes.find(n => n.id === conn.from);
              const toNode = countryNodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              
              // Calculer la longueur approximative pour ajuster l'animation
              const dx = toNode.x - fromNode.x;
              const dy = toNode.y - fromNode.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const dashArray = `${length * 0.15} ${length * 0.85}`;
              
              return (
                <motion.line
                  key={`flow-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="url(#flowGradient)"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  strokeDasharray={dashArray}
                  filter="url(#flowGlow)"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -length }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    ease: "linear",
                    repeat: Infinity,
                    delay: index * 0.15,
                  }}
                />
              );
            })}
          </g>
        )}

        {/* ===== LAYER 3: Nœuds pays ===== */}
        <g className="nodes">
          {countryNodes.map((node, index) => {
            const isMainHub = MAIN_HUB_IDS.includes(node.id);
            const nodeSize = isMainHub ? 1.4 : 0.7;
            const nodeColor = isMainHub ? "hsl(var(--nx-gold))" : "hsl(var(--nx-cyan))";
            
            return (
              <motion.g 
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.02, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15
                }}
              >
                {/* Effet radar (uniquement pour les hubs principaux) */}
                {isMainHub && shouldAnimate && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="0.2"
                    initial={{ r: nodeSize, opacity: 0.8 }}
                    animate={{
                      r: [nodeSize, nodeSize * 6],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                  />
                )}

                {/* Halo externe (respiration) */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize * 2.5}
                  fill={nodeColor}
                  opacity={0.1}
                  animate={shouldAnimate ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.08, 0.18, 0.08],
                  } : {}}
                  transition={{
                    duration: 3 + Math.random(),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.05,
                  }}
                />
                
                {/* Point central (pulse) */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize}
                  fill={nodeColor}
                  filter={isMainHub ? "url(#strongGlow)" : "url(#nodeGlow)"}
                  animate={shouldAnimate ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  } : { opacity: 0.9 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.03,
                  }}
                />
              </motion.g>
            );
          })}
        </g>
      </motion.svg>
    </div>
  );
}
