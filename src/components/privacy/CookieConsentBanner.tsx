import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrivacyConsent } from "./hooks/usePrivacyConsent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CONSENT_KEY = "cookie-consent-accepted";

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const { consent, updateConsent } = usePrivacyConsent();

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    updateConsent("analytics", true);
    updateConsent("marketing", true);
    updateConsent("functional", true);
    localStorage.setItem(CONSENT_KEY, "true");
    setVisible(false);
  };

  const saveCustom = () => {
    localStorage.setItem(CONSENT_KEY, "custom");
    setCustomizeOpen(false);
    setVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border border-border/30 bg-card/95 backdrop-blur-xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Cookie className="h-6 w-6 text-[hsl(var(--nx-gold))] shrink-0 mt-0.5 sm:mt-0" />
                <div className="flex-1 text-sm text-muted-foreground">
                  Ce site utilise des cookies pour améliorer votre expérience et
                  produire des statistiques anonymisées.{" "}
                  <Link
                    to="/legal/privacy"
                    className="text-[hsl(var(--nx-gold))] hover:underline"
                  >
                    Politique de confidentialité
                  </Link>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomizeOpen(true)}
                    className="border-border/40"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Personnaliser
                  </Button>
                  <Button
                    size="sm"
                    onClick={accept}
                    className="bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))] hover:bg-[hsl(var(--nx-gold))]/90"
                  >
                    Accepter
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="bg-card border-border/30">
          <DialogHeader>
            <DialogTitle>Gérer vos préférences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Cookies nécessaires</Label>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Cookies fonctionnels</Label>
              <Switch
                checked={consent.functional}
                onCheckedChange={(v) => updateConsent("functional", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Cookies analytiques</Label>
              <Switch
                checked={consent.analytics}
                onCheckedChange={(v) => updateConsent("analytics", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Cookies marketing</Label>
              <Switch
                checked={consent.marketing}
                onCheckedChange={(v) => updateConsent("marketing", v)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={saveCustom}
              className="bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))] hover:bg-[hsl(var(--nx-gold))]/90"
            >
              Enregistrer mes choix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
