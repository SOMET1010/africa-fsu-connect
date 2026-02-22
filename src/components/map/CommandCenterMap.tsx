import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Country } from "@/services/countriesService";
import { 
  getCountryActivity, 
  getActivityColor, 
  getValueByMode, 
  getLabelByMode,
  MapMode 
} from "./activityData";

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface CommandCenterMapProps {
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

// Variable marker size based on activity level
const getMarkerSize = (level: string): { size: number; inner: number; flag: number } => {
  switch (level) {
    case 'high': return { size: 52, inner: 8, flag: 22 };
    case 'medium': return { size: 44, inner: 6, flag: 18 };
    case 'low': return { size: 36, inner: 5, flag: 14 };
    default: return { size: 44, inner: 6, flag: 18 };
  }
};

export const CommandCenterMap = ({ 
  countries, 
  onCountryClick, 
  mode = 'members',
  isLoading 
}: CommandCenterMapProps) => {
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
      zoomControl: false, // We'll add custom controls
      scrollWheelZoom: true,
    });

    // CartoDB Dark Matter NO LABELS - ultra clean background
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
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

      // Get variable size based on activity level
      const markerDims = getMarkerSize(activity.level);

      // Random animation delay per country (0-2s) for organic breathing
      const animationDelay = ((country.code.charCodeAt(0) + country.code.charCodeAt(1)) % 20) / 10;

      // Create custom marker icon - HUD style with variable size
      const icon = L.divIcon({
        html: `
          <div class="command-marker" style="
            position: relative;
            width: ${markerDims.size}px;
            height: ${markerDims.size}px;
          ">
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              border: 2px solid ${color};
              opacity: 0.3;
            "></div>
            <div style="
              position: absolute;
              inset: ${markerDims.inner}px;
              border-radius: 50%;
              background: linear-gradient(135deg, ${color}33, ${color}66);
              border: 2px solid ${color};
              backdrop-filter: blur(4px);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 40px ${color}50, 0 0 80px ${color}20, inset 0 0 15px ${color}30;
            ">
              <span style="font-size: ${markerDims.flag}px; line-height: 1;">${flag}</span>
            </div>
            <div style="
              position: absolute;
              top: -6px;
              right: -6px;
              background: ${color};
              border-radius: 8px;
              min-width: 24px;
              height: 20px;
              padding: 0 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: white;
              box-shadow: 0 2px 8px ${color}60;
            ">${displayValue}${displaySuffix}</div>
          </div>
        `,
        className: "command-marker-container",
        iconSize: [markerDims.size, markerDims.size],
        iconAnchor: [markerDims.size / 2, markerDims.size / 2],
        popupAnchor: [0, -markerDims.size / 2],
      });

      const marker = L.marker([country.latitude, country.longitude], { icon });

      // Create popup content - Simplified 3 lines max
      const popupContent = `
        <div style="
          min-width: 160px;
          max-width: 200px;
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));
          border: 1px solid ${color}40;
          border-radius: 10px;
          padding: 12px 14px;
          backdrop-filter: blur(8px);
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
          ">
            <span style="font-size: 20px; line-height: 1;">${flag}</span>
            <strong style="font-size: 14px; color: white;">${country.name_fr}</strong>
          </div>
          <div style="
            font-size: 12px;
            color: rgba(255,255,255,0.7);
            margin-bottom: 4px;
          ">
            ${activity.contributions} contributions  •  ${activity.projects} projets
          </div>
          <div style="
            font-size: 11px;
            color: rgba(255,255,255,0.4);
          ">${activity.lastActivity}</div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: "command-popup",
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
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0"
        style={{
          filter: 'brightness(0.7) contrast(1.2) saturate(0.5) grayscale(0.3)',
        }}
      />
      
      {/* Custom CSS for markers */}
      <style>{`
        .command-marker-container {
          background: transparent !important;
          border: none !important;
        }
        
        .command-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
        }
        
        .command-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        
        .command-popup .leaflet-popup-tip-container {
          display: none !important;
        }
      `}</style>
    </>
  );
};
