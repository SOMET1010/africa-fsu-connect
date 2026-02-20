import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Sparkles, GraduationCap, Bot } from "lucide-react";
import { NexusNetworkPattern } from "@/components/shared/NexusNetworkPattern";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <footer className="relative bg-[hsl(var(--nx-night))] border-t border-[hsl(var(--nx-gold))]/30 mt-16 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Pattern réseau NEXUS */}
      <NexusNetworkPattern variant="soft" className="opacity-[0.05]" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className={cn("flex items-center gap-3 group", isRTL && "flex-row-reverse")}>
              <div className="relative w-12 h-12 bg-gradient-to-br from-[hsl(var(--nx-gold))] via-[hsl(var(--nx-gold))]/80 to-[hsl(var(--nx-network))] rounded-xl flex items-center justify-center shadow-lg shadow-[hsl(var(--nx-gold))]/20">
                <span className="text-[hsl(var(--nx-night))] font-bold text-sm">UDC</span>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-[hsl(var(--nx-gold))] opacity-80" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{t('footer.platform.name')}</h3>
                <p className="text-xs text-[hsl(var(--nx-gold))]/80 font-medium">UAT • ANSUT</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {t('footer.platform.description')}
            </p>
            <p className="text-xs text-[hsl(var(--nx-gold))]/60 italic">
              "{t('footer.platform.slogan')}"
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">{t('footer.modules.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}>
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.modules.database')}
                </Link>
              </li>
              <li>
                <Link to="/map" className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}>
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.modules.map')}
                </Link>
              </li>
              <li>
                <Link to="/resources" className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}>
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.modules.library')}
                </Link>
              </li>
              <li>
                <Link to="/forum" className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}>
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.modules.forum')}
                </Link>
              </li>
              <li>
                <Link to="/elearning" className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}>
                  <GraduationCap className={cn("h-3 w-3 text-[hsl(var(--nx-gold))]/60", isRTL ? "ml-2" : "mr-2")} />
                  {t('footer.modules.elearning')}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}>
                  <Bot className={cn("h-3 w-3 text-[hsl(var(--nx-gold))]/60", isRTL ? "ml-2" : "mr-2")} />
                  {t('footer.modules.assistant')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">{t('footer.partners.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://atu-uat.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}
                >
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.partners.uat')}
                </a>
              </li>
              <li>
                <a 
                  href="https://ansut.ci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}
                >
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.partners.ansut')}
                </a>
              </li>
              <li>
                <a 
                  href="https://au.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}
                >
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.partners.au')}
                </a>
              </li>
              <li>
                <a 
                  href="https://itu.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn("group flex items-center text-white/60 hover:text-[hsl(var(--nx-gold))] transition-all duration-300", isRTL && "flex-row-reverse")}
                >
                  <span className={cn("w-1 h-0 bg-[hsl(var(--nx-gold))] rounded-full transition-all duration-300 group-hover:h-3", isRTL ? "ml-0 group-hover:ml-2" : "mr-0 group-hover:mr-2")}></span>
                  {t('footer.partners.itu')}
                </a>
              </li>
              <li>
                <span className="text-xs text-white/40 block mt-2">
                  {t('footer.partners.regions')}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">{t('footer.contact.title')}</h4>
            <div className="space-y-3 text-sm">
              <div className={cn("group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300", isRTL && "flex-row-reverse")}>
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
              <div className={cn("group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300", isRTL && "flex-row-reverse")}>
                <div className="p-2 bg-[hsl(var(--nx-gold))]/10 rounded-lg group-hover:bg-[hsl(var(--nx-gold))]/20 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
                </div>
                <span className="text-white/60">+225 27 22 44 44 44</span>
              </div>
              <div className={cn("group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300", isRTL && "flex-row-reverse")}>
                <div className="p-2 bg-[hsl(var(--nx-gold))]/10 rounded-lg group-hover:bg-[hsl(var(--nx-gold))]/20 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
                </div>
                <span className="text-white/60">{t('footer.contact.location')}</span>
              </div>
              <div className={cn("group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300", isRTL && "flex-row-reverse")}>
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
            <div className={cn("text-sm text-white/50", isRTL ? "text-center md:text-right" : "text-center md:text-left")}>
              © {currentYear} {t('footer.copyright')}
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link to="/about" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                {t('footer.links.about')}
              </Link>
              <Link to="/roadmap" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                {t('footer.links.roadmap')}
              </Link>
              <Link to="/legal/privacy" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                {t('footer.links.privacy')}
              </Link>
              <Link to="/legal/terms" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                {t('footer.links.terms')}
              </Link>
              <Link to="/contact" className="text-white/50 hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[hsl(var(--nx-gold))] after:transition-all after:duration-300 hover:after:w-full">
                {t('footer.links.support')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
