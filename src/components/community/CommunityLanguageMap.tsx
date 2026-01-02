import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Country } from "@/services/countriesService";
import { motion } from "framer-motion";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LANGUAGE_COLORS: Record<string, { color: string; label: string; flag: string }> = {
  fr: { color: "#3B82F6", label: "Francophone", flag: "🇫🇷" },
  en: { color: "#10B981", label: "Anglophone", flag: "🇬🇧" },
  pt: { color: "#F59E0B", label: "Lusophone", flag: "🇵🇹" },
  ar: { color: "#8B5CF6", label: "Arabophone", flag: "🇸🇦" },
};

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface CommunityLanguageMapProps {
  countries: Country[];
}

export const CommunityLanguageMap = ({ countries }: CommunityLanguageMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  
  const [activeLanguages, setActiveLanguages] = useState<Record<string, boolean>>({
    fr: true,
    en: true,
    pt: true,
    ar: true,
  });

  // Count countries by language
  const languageCounts = countries.reduce((acc, country) => {
    const lang = country.official_language || "fr";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const createLanguageIcon = (language: string) => {
    const config = LANGUAGE_COLORS[language] || LANGUAGE_COLORS.fr;
    
    return L.divIcon({
      html: `
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: ${config.color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s ease;
        "></div>
      `,
      className: "language-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  const toggleLanguage = (lang: string) => {
    setActiveLanguages((prev) => ({
      ...prev,
      [lang]: !prev[lang],
    }));
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [5, 20],
      zoom: 3,
      minZoom: 2,
      maxZoom: 8,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when countries or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    countries.forEach((country) => {
      const lang = country.official_language || "fr";
      
      if (!activeLanguages[lang]) return;
      if (!country.latitude || !country.longitude) return;

      const langConfig = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.fr;
      const marker = L.marker([country.latitude, country.longitude], {
        icon: createLanguageIcon(lang),
      });

      const popupContent = `
        <div style="padding: 8px; min-width: 180px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 32px;">${getCountryFlag(country.code)}</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${country.name_fr}</h3>
              <p style="margin: 4px 0 0; font-size: 13px; color: #666;">
                ${langConfig.flag} ${langConfig.label}
              </p>
            </div>
          </div>
          <a href="/members?country=${country.code}" 
             style="color: #3B82F6; font-size: 13px; text-decoration: none;">
            Voir la fiche pays →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current?.addLayer(marker);
    });
  }, [countries, activeLanguages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Map container */}
          <div
            ref={mapRef}
            className="h-[500px] md:h-[600px] w-full z-0"
          />

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000]">
            <Card className="p-4 bg-background/95 backdrop-blur-sm shadow-lg">
              <h4 className="font-semibold text-sm mb-3 text-foreground">
                Communautés linguistiques
              </h4>
              <div className="space-y-2">
                {Object.entries(LANGUAGE_COLORS).map(([code, config]) => (
                  <label
                    key={code}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={activeLanguages[code]}
                      onCheckedChange={() => toggleLanguage(code)}
                    />
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {config.flag} {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({languageCounts[code] || 0})
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
