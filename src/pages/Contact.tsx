import { Mail, Phone, MapPin, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.form.success") || "Message envoyé avec succès");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative py-20 bg-[hsl(var(--nx-night))] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nx-gold))]/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-[hsl(var(--nx-gold))]/10 text-[hsl(var(--nx-gold))] border border-[hsl(var(--nx-gold))]/20">
            {t("contact.badge") || "Contact"}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("contact.title") || "Contactez-nous"}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t("contact.subtitle") || "Secrétariat de l'Union Africaine des Télécommunications"}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Coordonnées */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground">
              {t("contact.info.title") || "Nos coordonnées"}
            </h2>
            <div className="space-y-6">
              <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 rounded-xl bg-[hsl(var(--nx-gold))]/10">
                  <Mail className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("contact.info.email") || "Email"}</p>
                  <a href="mailto:secretariat@atu-uat.org" className="text-muted-foreground hover:text-[hsl(var(--nx-gold))] transition-colors">
                    secretariat@atu-uat.org
                  </a>
                </div>
              </div>
              <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 rounded-xl bg-[hsl(var(--nx-gold))]/10">
                  <Phone className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("contact.info.phone") || "Téléphone"}</p>
                  <span className="text-muted-foreground">+225 27 22 44 44 44</span>
                </div>
              </div>
              <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 rounded-xl bg-[hsl(var(--nx-gold))]/10">
                  <MapPin className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("contact.info.address") || "Adresse"}</p>
                  <span className="text-muted-foreground">
                    {t("contact.info.address.value") || "Abidjan, Côte d'Ivoire"}
                  </span>
                </div>
              </div>
              <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 rounded-xl bg-[hsl(var(--nx-gold))]/10">
                  <Globe className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("contact.info.website") || "Site officiel"}</p>
                  <a href="https://atu-uat.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nx-gold))] transition-colors">
                    atu-uat.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("contact.form.title") || "Envoyer un message"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">{t("contact.form.name") || "Nom complet"}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">{t("contact.form.email") || "Adresse email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="message">{t("contact.form.message") || "Message"}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  required
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" className="w-full bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))] hover:bg-[hsl(var(--nx-gold))]/90">
                <Send className="h-4 w-4 mr-2" />
                {t("contact.form.submit") || "Envoyer"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
