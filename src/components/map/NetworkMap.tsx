import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Country } from "@/services/countriesService";
import { 
  getCountryActivity, 
  getActivityColor, 
  getValueByMode, 
  getLabelByMode,
  ACTIVITY_LEVELS,
  MapMode 
} from "./activityData";

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface NetworkMapProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
  mode?: MapMode;
  isLoading?: boolean;
}

const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const NetworkMap = ({ 
  countries, 
  onCountryClick, 
  mode = 'members',
  isLoading 
}: NetworkMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [5, 20], // Center on Africa
      zoom: 3,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // CartoDB Positron tiles - clean, institutional style
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when countries or mode change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !countries.length) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    const valueLabel = getLabelByMode(mode);

    // Add markers for each country with coordinates
    countries.forEach((country) => {
      if (!country.latitude || !country.longitude) return;

      const activity = getCountryActivity(country.code);
      const color = getActivityColor(activity.level);
      const flag = getCountryFlag(country.code);
      const displayValue = getValueByMode(activity, mode);
      const displaySuffix = mode === 'trends' ? '%' : '';

      // Create custom marker icon
      const icon = L.divIcon({
        html: `
          <div class="network-marker" style="
            position: relative;
            width: 40px;
            height: 40px;
          ">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background-color: ${color};
              opacity: 0.3;
              animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            "></div>
            <div style="
              position: absolute;
              inset: 4px;
              border-radius: 50%;
              background-color: ${color};
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="font-size: 16px; line-height: 1;">${flag}</span>
            </div>
            <div style="
              position: absolute;
              top: -8px;
              right: -8px;
              background: white;
              border-radius: 10px;
              min-width: 22px;
              height: 22px;
              padding: 0 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: ${color};
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">${displayValue}${displaySuffix}</div>
          </div>
        `,
        className: "network-marker-container",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([country.latitude, country.longitude], { icon });

      // Create popup content with 3 lines max
      const popupContent = `
        <div style="
          min-width: 180px;
          max-width: 220px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          ">
            <span style="font-size: 28px; line-height: 1;">${flag}</span>
            <strong style="font-size: 15px;">${country.name_fr}</strong>
          </div>
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            background: ${color}12;
            border-radius: 8px;
            margin-bottom: 6px;
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${color};
              flex-shrink: 0;
            "></div>
            <span style="font-size: 13px; color: ${color}; font-weight: 600;">
              ${displayValue}${displaySuffix} ${valueLabel}
            </span>
          </div>
          <p style="
            font-size: 11px;
            color: #888;
            margin: 0;
          ">Dernière activité : ${activity.lastActivity}</p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: "network-popup",
      });

      marker.on("click", () => {
        onCountryClick(country);
      });

      marker.on("mouseover", () => {
        marker.openPopup();
      });

      marker.on("mouseout", () => {
        marker.closePopup();
      });

      markersRef.current?.addLayer(marker);
    });
  }, [countries, onCountryClick, mode]);

  if (isLoading) {
    return (
      <div className="h-[500px] rounded-2xl bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef} 
        className="h-[500px] rounded-2xl overflow-hidden border border-border shadow-inner"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border z-[1000]">
        <h5 className="font-semibold text-sm mb-3">Niveau d'activité</h5>
        <div className="space-y-2">
          {Object.entries(ACTIVITY_LEVELS).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for markers */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        .network-marker-container {
          background: transparent !important;
          border: none !important;
        }
        
        .network-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        
        .network-popup .leaflet-popup-content {
          margin: 12px;
        }
        
        .network-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};
