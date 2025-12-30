import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Sparkles, GraduationCap, Bot, Eye, PenTool } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-background via-muted/20 to-muted/40 border-t border-border/50 mt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fsu-blue rounded-full blur-3xl transform translate-y-1/2" />
      </div>
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section - Updated with ANSUT/UAT branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary via-primary to-fsu-blue rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">SUTEL</span>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary opacity-60" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg leading-tight">Plateforme SUTEL</h3>
                <p className="text-xs text-primary/80 font-medium">UAT • ANSUT</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La première plateforme africaine numérique dédiée à la collaboration, l'innovation 
              et la mutualisation des ressources pour réduire la fracture numérique. 
              Portée par l'UAT et l'ANSUT Côte d'Ivoire.
            </p>
            <p className="text-xs text-muted-foreground italic">
              "Connecter l'Afrique, Ensemble"
            </p>
          </div>

          {/* Quick Links - Updated with 11 modules */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-lg">Modules Principaux</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/database" className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300">
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Base de Données FSU
                </Link>
              </li>
              <li>
                <Link to="/map" className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300">
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Carte Interactive
                </Link>
              </li>
              <li>
                <Link to="/library" className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300">
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Bibliothèque Collaborative
                </Link>
              </li>
              <li>
                <Link to="/forum" className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300">
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Forum & Communauté
                </Link>
              </li>
              <li>
                <Link to="/elearning" className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300">
                  <GraduationCap className="h-3 w-3 mr-2 opacity-60" />
                  E-Learning
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300">
                  <Bot className="h-3 w-3 mr-2 opacity-60" />
                  Assistant SUTA
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-lg">Institutions Partenaires</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://atu-uat.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  UAT - Union Africaine des Télécommunications
                </a>
              </li>
              <li>
                <a 
                  href="https://ansut.ci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  ANSUT Côte d'Ivoire
                </a>
              </li>
              <li>
                <a 
                  href="https://au.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  Union Africaine
                </a>
              </li>
              <li>
                <a 
                  href="https://itu.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="w-1 h-0 bg-primary rounded-full transition-all duration-300 group-hover:h-3 mr-0 group-hover:mr-2"></span>
                  UIT - Union Internationale des Télécommunications
                </a>
              </li>
              <li>
                <span className="text-xs text-muted-foreground/70 block mt-2">
                  Régions: CEDEAO • SADC • EACO • ECCAS • UMA
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info - Updated */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-lg">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-300">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="mailto:secretariat@atu-uat.org" 
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  secretariat@atu-uat.org
                </a>
              </div>
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-300">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">+225 27 22 44 44 44</span>
              </div>
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-300">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-300">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="https://platform.atu-uat.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  platform.atu-uat.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Plateforme SUTEL - UAT & ANSUT. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                À propos
              </Link>
              <Link to="/roadmap" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                Feuille de Route
              </Link>
              <Link to="/legal/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                Confidentialité
              </Link>
              <Link to="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
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