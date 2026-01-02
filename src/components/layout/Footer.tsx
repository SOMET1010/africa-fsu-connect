import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Sparkles, GraduationCap, Bot } from "lucide-react";
import { NexusNetworkPattern } from "@/components/shared/NexusNetworkPattern";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[hsl(var(--nx-night))] border-t border-[hsl(var(--nx-gold))]/30 mt-16 overflow-hidden">
      {/* Pattern réseau NEXUS */}
      <NexusNetworkPattern variant="soft" className="opacity-[0.05]" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section - Updated with ANSUT/UAT branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 bg-gradient-to-br from-[hsl(var(--nx-gold))] via-[hsl(var(--nx-gold))]/80 to-[hsl(var(--nx-network))] rounded-xl flex items-center justify-center shadow-lg shadow-[hsl(var(--nx-gold))]/20">
                <span className="text-[hsl(var(--nx-night))] font-bold text-sm">NEXUS</span>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-[hsl(var(--nx-gold))] opacity-80" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">Plateforme NEXUS</h3>
                <p className="text-xs text-[hsl(var(--nx-gold))]/80 font-medium">UAT • ANSUT</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              La première plateforme africaine numérique dédiée à la collaboration, l'innovation 
              et la mutualisation des ressources pour réduire la fracture numérique. 
              Portée par l'UAT et l'ANSUT Côte d'Ivoire.
            </p>
            <p className="text-xs text-[hsl(var(--nx-gold))]/60 italic">
              "Connecter l'Afrique, Ensemble"
            </p>
          </div>

          {/* Quick Links - Updated with 11 modules */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Modules Principaux</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300">
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Base de Données FSU
                </Link>
              </li>
              <li>
                <Link to="/map" className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300">
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Carte Interactive
                </Link>
              </li>
              <li>
                <Link to="/resources" className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300">
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Bibliothèque Collaborative
                </Link>
              </li>
              <li>
                <Link to="/forum" className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300">
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Forum & Communauté
                </Link>
              </li>
              <li>
                <Link to="/elearning" className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300">
                  <GraduationCap className="h-3 w-3 mr-2 text-[hsl(var(--nx-gold))]/60" />
                  E-Learning
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300">
                  <Bot className="h-3 w-3 mr-2 text-[hsl(var(--nx-gold))]/60" />
                  Assistant SUTA
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Institutions Partenaires</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://atu-uat.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  UAT - Union Africaine des Télécommunications
                </a>
              </li>
              <li>
                <a 
                  href="https://ansut.ci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  ANSUT Côte d'Ivoire
                </a>
              </li>
              <li>
                <a 
                  href="https://au.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Union Africaine
                </a>
              </li>
              <li>
                <a 
                  href="https://itu.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  UIT - Union Internationale des Télécommunications
                </a>
              </li>
              <li>
                <span className="text-xs text-white/40 block mt-2">
                  Régions: CEDEAO • SADC • EACO • ECCAS • UMA
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info - Updated */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                <div className="p-2 bg-[hsl(var(--nx-gold))]/10 rounded-lg group-hover:bg-[hsl(var(--nx-gold))]/20 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
                </div>
                <a 
                  href="mailto:secretariat@atu-uat.org" 
                  className="text-white/60 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300"
                >
                  secretariat@atu-uat.org
                </a>
              </div>
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                <div className="p-2 bg-[hsl(var(--nx-gold))]/10 rounded-lg group-hover:bg-[hsl(var(--nx-gold))]/20 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
                </div>
                <span className="text-white/60">+225 27 22 44 44 44</span>
              </div>
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                <div className="p-2 bg-[hsl(var(--nx-gold))]/10 rounded-lg group-hover:bg-[hsl(var(--nx-gold))]/20 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
                </div>
                <span className="text-white/60">Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                <div className="p-2 bg-[hsl(var(--nx-gold))]/10 rounded-lg group-hover:bg-[hsl(var(--nx-gold))]/20 transition-colors duration-300">
                  <Globe className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
                </div>
                <a 
                  href="https://platform.atu-uat.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300"
                >
                  platform.atu-uat.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur doré */}
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--nx-gold))]/50 to-transparent mt-12" />

        {/* Bottom Section */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-sm text-white/50 text-center md:text-left">
              © {currentYear} Plateforme NEXUS - UAT & ANSUT. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link to="/about" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                À propos
              </Link>
              <Link to="/roadmap" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                Feuille de Route
              </Link>
              <Link to="/legal/privacy" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                Confidentialité
              </Link>
              <Link to="/legal/terms" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;