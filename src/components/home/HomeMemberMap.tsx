import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Country } from "@/services/countriesService";
import { getCountryActivity, ACTIVITY_LEVELS } from "@/components/map/activityData";

interface HomeMemberMapProps {
  countries: Country[];
  onCountryClick?: (country: Country) => void;
}

const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const STATUS_LABELS: Record<string, string> = {
  high: "Très actif",
  medium: "Membre actif",
  onboarding: "En intégration",
  observer: "Observateur",
};

export const HomeMemberMap = ({ countries, onCountryClick }: HomeMemberMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [5, 20],
      zoom: 3,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Compact attribution
    L.control.attribution({ position: "bottomright", prefix: false })
      .addAttribution('© <a href="https://carto.com">CARTO</a>')
      .addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !countries.length) return;
    markersRef.current.clearLayers();

    countries.forEach((country) => {
      if (!country.latitude || !country.longitude) return;

      const activity = getCountryActivity(country.code);
      const color = ACTIVITY_LEVELS[activity.level]?.color ?? "#9CA3AF";
      const flag = getCountryFlag(country.code);
      const statusLabel = STATUS_LABELS[activity.level] ?? "Observateur";

      const size = 36;

      const icon = L.divIcon({
        html: `
          <div style="
            width: ${size}px; height: ${size}px;
            border-radius: 50%;
            background: ${color}22;
            border: 2px solid ${color};
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 12px ${color}30;
            transition: transform 0.2s ease;
          ">
            <span style="font-size: 16px; line-height: 1;">${flag}</span>
          </div>
        `,
        className: "home-map-marker",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([country.latitude, country.longitude], { icon });

      const popupContent = `
        <div style="
          min-width: 140px;
          font-family: system-ui, -apple-system, sans-serif;
          background: rgba(15,23,42,0.92);
          border: 1px solid ${color}50;
          border-radius: 8px;
          padding: 10px 12px;
          backdrop-filter: blur(8px);
        ">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="font-size:18px;">${flag}</span>
            <strong style="font-size:13px; color:white;">${country.name_fr}</strong>
          </div>
          <div style="
            display:inline-block;
            font-size:11px;
            color:${color};
            background:${color}18;
            border:1px solid ${color}30;
            border-radius:4px;
            padding:2px 6px;
          ">${statusLabel}</div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: "home-map-popup",
      });

      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
      if (onCountryClick) {
        marker.on("click", () => onCountryClick(country));
      }

      markersRef.current?.addLayer(marker);
    });
  }, [countries, onCountryClick]);

  return (
    <>
      <div ref={mapContainerRef} className="absolute inset-0" />
      <style>{`
        .home-map-marker { background: transparent !important; border: none !important; }
        .home-map-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        .home-map-popup .leaflet-popup-content { margin: 0 !important; }
        .home-map-popup .leaflet-popup-tip-container { display: none !important; }
        .home-map-marker:hover > div { transform: scale(1.15); }
      `}</style>
    </>
  );
};
