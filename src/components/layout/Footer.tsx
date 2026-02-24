import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, GraduationCap, Bot } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <footer className="relative bg-primary-dark border-t border-border" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="space-y-4">
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">UDC</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{t('footer.platform.name')}</h3>
                <p className="text-xs text-white/60 font-medium">UAT • ANSUT</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {t('footer.platform.description')}
            </p>
            <p className="text-xs text-white/50 italic">
              "{t('footer.platform.slogan')}"
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">{t('footer.modules.title')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/projects', label: t('footer.modules.database') },
                { to: '/map', label: t('footer.modules.map') },
                { to: '/resources', label: t('footer.modules.library') },
                { to: '/forum', label: t('footer.modules.forum') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/60 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/elearning" className={cn("flex items-center text-white/60 hover:text-white transition-colors duration-200", isRTL && "flex-row-reverse")}>
                  <GraduationCap className={cn("h-3.5 w-3.5", isRTL ? "ml-2" : "mr-2")} />
                  {t('footer.modules.elearning')}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className={cn("flex items-center text-white/60 hover:text-white transition-colors duration-200", isRTL && "flex-row-reverse")}>
                  <Bot className={cn("h-3.5 w-3.5", isRTL ? "ml-2" : "mr-2")} />
                  {t('footer.modules.assistant')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">{t('footer.partners.title')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: 'https://www.atuuat.africa', label: t('footer.partners.uat') },
                { href: 'https://ansut.ci', label: t('footer.partners.ansut') },
                { href: 'https://au.int', label: t('footer.partners.au') },
                { href: 'https://itu.int', label: t('footer.partners.itu') },
              ].map(link => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <span className="text-xs text-white/40 block mt-2">{t('footer.partners.regions')}</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">{t('footer.contact.title')}</h4>
            <div className="space-y-3 text-sm">
              {[
                { icon: Mail, content: <a href="mailto:secretariat@atuuat.africa" className="text-white/60 hover:text-white transition-colors">secretariat@atuuat.africa</a> },
                { icon: Phone, content: <span className="text-white/60">+225 27 22 44 44 44</span> },
                { icon: MapPin, content: <span className="text-white/60">{t('footer.contact.location')}</span> },
                { icon: Globe, content: <a href="https://www.atuuat.africa" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">www.atuuat.africa</a> },
              ].map(({ icon: Icon, content }, i) => (
                <div key={i} className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="h-4 w-4 text-white/70" />
                  </div>
                  {content}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-white/15 mt-12" />

        {/* Bottom */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/50">
              © {currentYear} {t('footer.copyright')}
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              {[
                { to: '/about', label: t('footer.links.about') },
                { to: '/roadmap', label: t('footer.links.roadmap') },
                { to: '/legal/privacy', label: t('footer.links.privacy') },
                { to: '/legal/terms', label: t('footer.links.terms') },
                { to: '/contact', label: t('footer.links.support') },
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-white/50 hover:text-white transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
