import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FSU</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Plateforme FSU Afrique</h3>
                <p className="text-xs text-muted-foreground">UAT • ANSUT</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Plateforme panafricaine de collaboration et d'innovation pour les Fonds de Service Universel, 
              portée par l'Union Africaine des Télécommunications et l'ANSUT Côte d'Ivoire.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bibliothèque de Ressources
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-muted-foreground hover:text-foreground transition-colors">
                  Forum de Discussion
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projets FSU
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Événements
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Institutions Partenaires</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://uat.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Union Africaine des Télécommunications
                </a>
              </li>
              <li>
                <a 
                  href="https://ansut.ci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ANSUT Côte d'Ivoire
                </a>
              </li>
              <li>
                <a 
                  href="https://au.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Union Africaine
                </a>
              </li>
              <li>
                <a 
                  href="https://itu.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Union Internationale des Télécommunications
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="mailto:contact@fsu-afrique.org" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  contact@fsu-afrique.org
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+225 27 22 44 44 44</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://uat.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  uat.int
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Plateforme FSU Afrique. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Politique de Confidentialité
              </Link>
              <Link to="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Conditions d'Utilisation
              </Link>
              <Link to="/legal/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Politique des Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;