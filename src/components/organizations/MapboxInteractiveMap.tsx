import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Search, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface MapboxInteractiveMapProps {
  agencies: Agency[];
}

// Coordonnées correctes des capitales africaines [longitude, latitude]
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "Sénégal": [-17.4441, 14.6928], // Dakar
  "Côte d'Ivoire": [-4.0305, 5.3600], // Abidjan  
  "Nigeria": [7.5244, 9.0765], // Abuja
  "Kenya": [36.8219, -1.2921], // Nairobi
  "Ghana": [-0.1870, 5.6037], // Accra
  "Afrique du Sud": [28.2293, -25.7479], // Johannesburg
  "Rwanda": [30.0619, -1.9441], // Kigali
  "Uganda": [32.5825, 0.3476], // Kampala
  // Pays supplémentaires pour référence future
  "Tanzanie": [39.2083, -6.7924], // Dar es Salaam
  "Zambie": [28.2871, -15.3875], // Lusaka
  "Botswana": [25.9087, -24.6282], // Gaborone
  "Namibie": [17.0658, -22.5609], // Windhoek
  "Burkina Faso": [-1.5616, 12.2383], // Ouagadougou
  "Mali": [-7.9889, 12.6392], // Bamako
  "Niger": [2.1111, 13.5116], // Niamey
  "Tchad": [15.0444, 12.1348], // N'Djamena
  "Cameroun": [11.5174, 3.8480], // Yaoundé
  "Gabon": [9.4673, 0.4162], // Libreville
  "Congo": [15.2662, -4.2634], // Brazzaville
  "RDC": [15.2663, -4.4419], // Kinshasa
};

const SYNC_STATUS_COLORS = {
  'synced': '#10b981', // green
  'pending': '#f59e0b', // amber
  'failed': '#ef4444', // red
  'inactive': '#6b7280' // gray
};

export const MapboxInteractiveMap = ({ agencies }: MapboxInteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch Mapbox token on component mount
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setIsLoadingToken(true);
        setTokenError('');
        
        console.log('Calling get-mapbox-token function...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setTokenError(`Erreur Edge Function: ${error.message}`);
          return;
        }
        
        if (data?.token) {
          console.log('Token received successfully');
          setMapboxToken(data.token);
        } else {
          console.error('No token in response:', data);
          setTokenError('Token Mapbox non disponible dans la réponse');
        }
      } catch (error) {
        console.error('Error in fetchMapboxToken:', error);
        setTokenError(`Erreur réseau: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchMapboxToken();
  }, []);

  // Clear all existing markers
  const clearMarkers = () => {
    markers.current.forEach(marker => {
      marker.remove();
    });
    markers.current = [];
    console.log('Cleared all markers');
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
      console.log(`Processing agency: ${agency.acronym} in ${agency.country}`, coordinates);
      if (!coordinates) {
        console.log(`❌ No coordinates found for country: ${agency.country}`);
        return;
      }
      console.log(`✅ Adding marker for ${agency.acronym} at coordinates:`, coordinates);

      // Create a DOM element for the marker
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${SYNC_STATUS_COLORS[agency.sync_status as keyof typeof SYNC_STATUS_COLORS] || SYNC_STATUS_COLORS.inactive};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        position: relative;
      `;

      // Add a pulsing animation for synced agencies
      if (agency.sync_status === 'synced') {
        markerEl.style.animation = 'pulse 2s infinite';
      }

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(coordinates)
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
              background-color: ${SYNC_STATUS_COLORS[agency.sync_status as keyof typeof SYNC_STATUS_COLORS]}20;
              color: ${SYNC_STATUS_COLORS[agency.sync_status as keyof typeof SYNC_STATUS_COLORS]};
              border: 1px solid ${SYNC_STATUS_COLORS[agency.sync_status as keyof typeof SYNC_STATUS_COLORS]};
            ">
              ${agency.sync_status}
            </span>
          </div>
          ${agency.website_url ? `<a href="${agency.website_url}" target="_blank" style="font-size: 12px; color: #3b82f6;">Voir le site →</a>` : ''}
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent);

      // Add click event to marker
      markerEl.addEventListener('click', () => {
        setSelectedAgency(agency);
        marker.setPopup(popup).togglePopup();
      });
    });

    console.log(`Successfully added ${markers.current.length} markers`);
  };

  // Initialize map once when token is available
  useEffect(() => {
    if (!mapboxToken || isLoadingToken || map.current) return;

    if (!mapContainer.current) {
      console.error('Map container not available');
      return;
    }

    try {
      console.log('Initializing Mapbox map...');
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe' as any,
        zoom: 2,
        center: [20, 0], // Centre sur l'Afrique
        pitch: 0,
      });

      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('Erreur Mapbox:', e);
        setTokenError('Erreur: Token Mapbox invalide ou problème de connexion');
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere effects
      map.current.on('style.load', () => {
        if (map.current) {
          map.current.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.1,
          });
          console.log('Map style loaded, adding initial markers...');
          addMarkersToMap(filteredAgencies);
        }
      });

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      setTokenError('Erreur: Token Mapbox invalide');
    }

    // Cleanup only when component unmounts
    return () => {
      if (map.current) {
        console.log('Cleaning up map...');
        clearMarkers();
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, isLoadingToken]);

  // Update markers when filtered agencies change (but don't recreate the map)
  useEffect(() => {
    if (!map.current || isLoadingToken) return;

    console.log('Updating markers for filtered agencies...');
    clearMarkers();
    addMarkersToMap(filteredAgencies);
  }, [filteredAgencies]);

  if (isLoadingToken) {
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Chargement de la carte Mapbox...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <div className="text-red-500">
            <h3 className="text-lg font-semibold mb-2">Erreur de configuration</h3>
            <p>{tokenError}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Carte interactive des agences SUTEL</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pour afficher la carte interactive, veuillez entrer votre token public Mapbox.
            Vous pouvez l'obtenir sur <a href="https://mapbox.com/" target="_blank" className="text-primary hover:underline">mapbox.com</a>
          </p>
          
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="pk.eyJ1Ijo..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button disabled>
              <Globe className="h-4 w-4 mr-2" />
              Configuration automatique...
            </Button>
          </div>
        </div>
      </Card>
    );
  }

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
