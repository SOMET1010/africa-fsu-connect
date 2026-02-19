import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Country } from "@/services/countriesService";
import { getCountryActivity, ACTIVITY_LEVELS, type MapMode, getValueByMode } from "@/components/map/activityData";

interface HomeMemberMapProps {
  countries: Country[];
  onCountryClick?: (country: Country) => void;
  mode?: MapMode;
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

const getMarkerSize = (value: number, maxValue: number): number => {
  if (maxValue <= 0) return 28;
  return Math.round(28 + (value / maxValue) * 20);
};

export const HomeMemberMap = ({ countries, onCountryClick, mode = 'members' }: HomeMemberMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [2, 20],
      zoom: 3.5,
      minZoom: 3,
      maxZoom: 6,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
      attributionControl: false,
      maxBounds: L.latLngBounds([-40, -25], [40, 55]),
      maxBoundsViscosity: 0.8,
    });

    // CartoDB Dark Matter WITH labels/borders
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.attribution({ position: "bottomright", prefix: false })
      .addAttribution('© <a href="https://carto.com" style="color:#888">CARTO</a>')
      .addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when countries or mode changes
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !countries.length) return;
    markersRef.current.clearLayers();

    // Calculate max value for proportional sizing
    const maxValue = Math.max(
      ...countries.map((c) => {
        const activity = getCountryActivity(c.code);
        return getValueByMode(activity, mode);
      }),
      1
    );

    countries.forEach((country) => {
      if (!country.latitude || !country.longitude) return;

      const activity = getCountryActivity(country.code);
      const color = ACTIVITY_LEVELS[activity.level]?.color ?? "#9CA3AF";
      const flag = getCountryFlag(country.code);
      const statusLabel = STATUS_LABELS[activity.level] ?? "Observateur";
      const value = getValueByMode(activity, mode);
      const size = getMarkerSize(value, maxValue);

      const icon = L.divIcon({
        html: `
          <div class="home-marker" style="
            width: ${size}px; height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, ${color}40, ${color}15);
            border: 2px solid ${color};
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 ${size / 2}px ${color}25, 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <span style="font-size: ${Math.max(11, size * 0.3)}px; font-weight: 700; color: ${color}; letter-spacing: 0.5px; line-height: 1;">${country.code}</span>
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
          min-width: 180px;
          font-family: system-ui, -apple-system, sans-serif;
          background: rgba(10, 15, 30, 0.95);
          border: 1px solid ${color}40;
          border-radius: 10px;
          padding: 12px 14px;
          backdrop-filter: blur(12px);
        ">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-size:20px;">${flag}</span>
            <strong style="font-size:14px; color:#fff; font-weight:600;">${country.name_fr}</strong>
          </div>
          <div style="
            display:inline-block;
            font-size:11px;
            color:${color};
            background:${color}18;
            border:1px solid ${color}30;
            border-radius:6px;
            padding:3px 8px;
            font-weight:500;
            margin-bottom:10px;
          ">${statusLabel}</div>
          <div style="display:flex; gap:16px; font-size:12px; color:#ccc;">
            <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
              <span style="font-size:16px; font-weight:700; color:#fff;">${activity.contributions}</span>
              <span style="font-size:10px; color:#999;">contributions</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
              <span style="font-size:16px; font-weight:700; color:#fff;">${activity.projects}</span>
              <span style="font-size:10px; color:#999;">projets</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
              <span style="font-size:16px; font-weight:700; color:#fff;">${activity.trendScore}%</span>
              <span style="font-size:10px; color:#999;">tendance</span>
            </div>
          </div>
          <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.08); font-size:10px; color:#777;">
            Dernière activité : ${activity.lastActivity}
          </div>
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
  }, [countries, onCountryClick, mode]);

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
        .home-marker { transition: transform 0.2s ease; }
        .home-map-marker:hover .home-marker { transform: scale(1.2); }
        .leaflet-tile-pane {
          filter: hue-rotate(210deg) saturate(0.7) brightness(1.1);
        }
      `}</style>
    </>
  );
};
