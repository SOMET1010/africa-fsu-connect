
import React, { useEffect, useRef, useState } from 'react';
import { logger } from '@/utils/logger';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { CountriesService } from '@/services/countriesService';

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
  const loggedCountries = useRef<Set<string>>(new Set());
  const isValidCoordinates = (coords?: [number, number]) => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
    const [lat, lng] = coords;
    return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [countryCoordinates, setCountryCoordinates] = useState<Record<string, [number, number]>>({});

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load country coordinates on mount
  useEffect(() => {
    const loadCountryCoordinates = async () => {
      try {
        const coords = await CountriesService.getCountryCoordinatesMap();
        setCountryCoordinates(coords);
      } catch (error) {
        logger.error('Failed to load country coordinates', error, { component: 'LeafletInteractiveMap' });
      }
    };

    loadCountryCoordinates();
  }, []);

  // Clear all existing markers
  const clearMarkers = () => {
    markers.current.forEach(marker => {
      if (map.current) {
        map.current.removeLayer(marker);
      }
    });
    markers.current = [];
    logger.debug('Cleared all markers', { component: 'LeafletInteractiveMap' });
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
      logger.warn('Map not initialized yet', { component: 'LeafletInteractiveMap' });
      return;
    }

    logger.info('Adding markers to map', { count: agenciesToShow.length, component: 'LeafletInteractiveMap' });
    
    agenciesToShow.forEach((agency) => {
      const coordinates = countryCoordinates[agency.country];
      if (!isValidCoordinates(coordinates)) {
        if (!loggedCountries.current.has(agency.country)) {
          logger.warn('Invalid or missing coordinates for country', { country: agency.country, agency: agency.acronym, component: 'LeafletInteractiveMap' });
          loggedCountries.current.add(agency.country);
        }
        return;
      }
      logger.debug('Adding marker for agency', { agency: agency.acronym, coordinates, component: 'LeafletInteractiveMap' });

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
        logger.error(`Error creating marker for ${agency.acronym}`, markerError, { agency: agency.acronym, component: 'LeafletInteractiveMap' });
      }
    });

    logger.info('Successfully added markers', { count: markers.current.length, component: 'LeafletInteractiveMap' });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      logger.info('Initializing Leaflet map...', { component: 'LeafletInteractiveMap' });
      
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

      logger.info('Map initialized successfully', { component: 'LeafletInteractiveMap' });

      // Add initial markers after map is ready
      const markerTimeout = setTimeout(() => {
        logger.info('Adding initial markers...', { component: 'LeafletInteractiveMap' });
        addMarkersToMap(filteredAgencies);
      }, 100);

      // Store timeout for cleanup
      return () => {
        clearTimeout(markerTimeout);
      };

    } catch (error) {
      logger.error('Error initializing Leaflet map', error, { component: 'LeafletInteractiveMap' });
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (map.current) {
        logger.debug('Cleaning up map...', { component: 'LeafletInteractiveMap' });
        try {
          // Clear all markers first
          clearMarkers();
          // Remove map tiles and layers
          map.current.eachLayer((layer) => {
            map.current!.removeLayer(layer);
          });
          // Remove the map instance
          map.current.remove();
        } catch (cleanupError) {
          logger.warn('Error during cleanup', { error: cleanupError, component: 'LeafletInteractiveMap' });
        }
        map.current = null;
      }
    };
  }, []);

  // Update markers when filtered agencies change
  useEffect(() => {
    if (!map.current || Object.keys(countryCoordinates).length === 0) return;

    logger.debug('Updating markers for filtered agencies...', { component: 'LeafletInteractiveMap' });
    clearMarkers();
    addMarkersToMap(filteredAgencies);
  }, [filteredAgencies, countryCoordinates]);

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
