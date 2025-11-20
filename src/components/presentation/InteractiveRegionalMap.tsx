import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Building2, Layers } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAgencies } from "@/hooks/useAgencies";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const regionColors: { [key: string]: string } = {
  "West Africa": "#3b82f6",
  "Southern Africa": "#22c55e",
  "East Africa": "#a855f7",
  "Central Africa": "#ef4444",
  "North Africa": "#f97316"
};

export function InteractiveRegionalMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { agencies, loading } = useAgencies();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || loading) return;

    // Initialize map centered on Africa
    const map = L.map(mapRef.current).setView([0, 20], 3);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add markers for agencies
    if (agencies && agencies.length > 0) {
      const markerCluster: { [region: string]: L.Marker[] } = {};

      agencies.forEach((agency) => {
        // Use approximate coordinates based on country
        // In a real implementation, these would come from the database
        const coords = getCountryCoordinates(agency.country);
        if (!coords) return;

        const color = regionColors[agency.region] || "#6366f1";
        
        const marker = L.marker([coords.lat, coords.lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        });

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${agency.name}</h3>
            <p style="margin: 4px 0;"><strong>Pays:</strong> ${agency.country}</p>
            <p style="margin: 4px 0;"><strong>Région:</strong> ${agency.region}</p>
            <p style="margin: 4px 0;"><strong>Acronyme:</strong> ${agency.acronym}</p>
            ${agency.website_url ? `<a href="${agency.website_url}" target="_blank" style="color: #3b82f6; text-decoration: underline;">Visiter le site</a>` : ''}
          </div>
        `);

        marker.addTo(map);

        if (!markerCluster[agency.region]) {
          markerCluster[agency.region] = [];
        }
        markerCluster[agency.region].push(marker);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [agencies, loading]);

  if (loading) {
    return (
      <Card className="p-8">
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Layers className="h-12 w-12 text-primary mx-auto animate-pulse" />
            <p className="text-muted-foreground">Chargement de la carte interactive...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Carte Interactive - Présence SUTEL</h3>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {agencies?.length || 0} Agences
          </Badge>
        </div>

        <div 
          ref={mapRef} 
          className="h-[500px] rounded-lg overflow-hidden border-2 border-border"
        />

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {Object.entries(regionColors).map(([region, color]) => (
            <div key={region} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium">{region}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// Helper function to get approximate coordinates for African countries
function getCountryCoordinates(country: string): { lat: number; lng: number } | null {
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    "Senegal": { lat: 14.4974, lng: -14.4524 },
    "Nigeria": { lat: 9.0820, lng: 8.6753 },
    "Ghana": { lat: 7.9465, lng: -1.0232 },
    "Kenya": { lat: -0.0236, lng: 37.9062 },
    "South Africa": { lat: -30.5595, lng: 22.9375 },
    "Egypt": { lat: 26.8206, lng: 30.8025 },
    "Morocco": { lat: 31.7917, lng: -7.0926 },
    "Ethiopia": { lat: 9.1450, lng: 40.4897 },
    "Tanzania": { lat: -6.3690, lng: 34.8888 },
    "Cameroon": { lat: 7.3697, lng: 12.3547 },
    "Ivory Coast": { lat: 7.5400, lng: -5.5471 },
    "Uganda": { lat: 1.3733, lng: 32.2903 },
    "Zimbabwe": { lat: -19.0154, lng: 29.1549 },
    "Botswana": { lat: -22.3285, lng: 24.6849 },
    "Rwanda": { lat: -1.9403, lng: 29.8739 },
  };

  return coordinates[country] || null;
}
