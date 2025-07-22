
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  sync_status: string;
  acronym: string;
  website_url?: string;
  description?: string;
}

interface LeafletInteractiveMapProps {
  agencies: Agency[];
}

// Coordonnées correctes des capitales africaines [latitude, longitude]
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "Sénégal": [14.6928, -17.4441], // Dakar
  "Côte d'Ivoire": [5.3600, -4.0305], // Abidjan  
  "Nigeria": [9.0765, 7.5244], // Abuja
  "Kenya": [-1.2921, 36.8219], // Nairobi
  "Ghana": [5.6037, -0.1870], // Accra
  "Afrique du Sud": [-25.7479, 28.2293], // Johannesburg
  "Rwanda": [-1.9441, 30.0619], // Kigali
  "Uganda": [0.3476, 32.5825], // Kampala
  // Pays supplémentaires pour référence future
  "Tanzanie": [-6.7924, 39.2083], // Dar es Salaam
  "Zambie": [-15.3875, 28.2871], // Lusaka
  "Botswana": [-24.6282, 25.9087], // Gaborone
  "Namibie": [-22.5609, 17.0658], // Windhoek
  "Burkina Faso": [12.2383, -1.5616], // Ouagadougou
  "Mali": [12.6392, -7.9889], // Bamako
  "Niger": [13.5116, 2.1111], // Niamey
  "Tchad": [12.1348, 15.0444], // N'Djamena
  "Cameroun": [3.8480, 11.5174], // Yaoundé
  "Gabon": [0.4162, 9.4673], // Libreville
  "Congo": [-4.2634, 15.2662], // Brazzaville
  "RDC": [-4.4419, 15.2663], // Kinshasa
};

const SYNC_STATUS_COLORS = {
  'synced': '#10b981', // green
  'pending': '#f59e0b', // amber
  'failed': '#ef4444', // red
  'inactive': '#6b7280' // gray
};

export const LeafletInteractiveMap = ({ agencies }: LeafletInteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clear all existing markers
  const clearMarkers = () => {
    markers.current.forEach(marker => {
      if (map.current) {
        map.current.removeLayer(marker);
      }
    });
    markers.current = [];
    console.log('Cleared all markers');
  };

  // Create custom marker icon
  const createCustomIcon = (color: string, isPulsing: boolean = false) => {
    const iconHtml = `
      <div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${isPulsing ? 'animation: pulse 2s infinite;' : ''}
      "></div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  };

  // Add markers to the map
  const addMarkersToMap = (agenciesToShow: Agency[]) => {
    if (!map.current) {
      console.log('Map not initialized yet');
      return;
    }

    console.log(`Adding ${agenciesToShow.length} markers to map`);
    
    agenciesToShow.forEach((agency) => {
      const coordinates = COUNTRY_COORDINATES[agency.country];
      if (!coordinates) {
        console.log(`❌ No coordinates found for country: ${agency.country}`);
        return;
      }
      console.log(`✅ Adding marker for ${agency.acronym} at coordinates:`, coordinates);

      const color = SYNC_STATUS_COLORS[agency.sync_status as keyof typeof SYNC_STATUS_COLORS] || SYNC_STATUS_COLORS.inactive;
      const isPulsing = agency.sync_status === 'synced';
      const icon = createCustomIcon(color, isPulsing);

      try {
        const marker = L.marker(coordinates, { icon })
          .addTo(map.current!);

        // Store marker reference
        markers.current.push(marker);

        // Create popup content
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${agency.acronym}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${agency.name}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Pays:</strong> ${agency.country}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Région:</strong> ${agency.region}</p>
            <div style="margin: 0 0 8px 0;">
              <span style="
                display: inline-block;
                padding: 2px 6px;
                border-radius: 12px;
                font-size: 10px;
                background-color: ${color}20;
                color: ${color};
                border: 1px solid ${color};
              ">
                ${agency.sync_status}
              </span>
            </div>
            ${agency.website_url ? `<a href="${agency.website_url}" target="_blank" style="font-size: 12px; color: #3b82f6;">Voir le site →</a>` : ''}
          </div>
        `;

        // Bind popup to marker
        marker.bindPopup(popupContent);

        // Add click event
        marker.on('click', () => {
          setSelectedAgency(agency);
        });

      } catch (markerError) {
        console.error(`Error creating marker for ${agency.acronym}:`, markerError);
      }
    });

    console.log(`Successfully added ${markers.current.length} markers`);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Initializing Leaflet map...');
      
      // Create map centered on Africa
      map.current = L.map(mapContainer.current, {
        center: [0, 20], // Centre sur l'Afrique
        zoom: 3,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      });

      // Add OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map.current);

      console.log('Map initialized successfully');

      // Add initial markers
      setTimeout(() => {
        console.log('Adding initial markers...');
        addMarkersToMap(filteredAgencies);
      }, 100);

    } catch (error) {
      console.error('Error initializing Leaflet map:', error);
    }

    // Cleanup
    return () => {
      if (map.current) {
        console.log('Cleaning up map...');
        try {
          clearMarkers();
          map.current.remove();
        } catch (cleanupError) {
          console.warn('Error during cleanup:', cleanupError);
        }
        map.current = null;
      }
    };
  }, []);

  // Update markers when filtered agencies change
  useEffect(() => {
    if (!map.current) return;

    console.log('Updating markers for filtered agencies...');
    clearMarkers();
    addMarkersToMap(filteredAgencies);
  }, [filteredAgencies]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Carte interactive des agences SUTEL</h3>
        </div>
        <Badge variant="outline">{filteredAgencies.length} agences</Badge>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une agence ou un pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-border"
          style={{ minHeight: '400px' }}
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
          <h4 className="text-sm font-medium mb-2">État de synchronisation</h4>
          <div className="space-y-1">
            {Object.entries(SYNC_STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-muted-foreground capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </Card>
  );
};
