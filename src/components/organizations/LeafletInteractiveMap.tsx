
import React, { useEffect, useRef, useState } from 'react';
import { logger } from '@/utils/logger';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Search, Layers, Radio, Satellite, Wifi, Building2, 
  Globe, Users, Briefcase, BookOpen, Mail, ExternalLink,
  Activity, Flag, UserCheck, Clock
} from "lucide-react";
import { CountriesService } from '@/services/countriesService';
import { useProjects } from '@/hooks/useProjects';

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

// Network participation filters (P0 - Priority)
const PARTICIPATION_FILTERS = [
  { id: "active", label: "Pays actif", color: "#10b981", icon: UserCheck },
  { id: "member", label: "Pays membre", color: "#3b82f6", icon: Users },
  { id: "joining", label: "En adhésion", color: "#9ca3af", icon: Clock }
];

// Project type filters
const PROJECT_TYPE_FILTERS = [
  { id: "connectivity", label: "Connectivité rurale" },
  { id: "education", label: "Éducation" },
  { id: "health", label: "Santé" },
  { id: "backbone", label: "Backbone" }
];

// Technology filters (secondary)
const TECHNOLOGY_FILTERS = [
  { id: "4g", label: "4G LTE", icon: Radio, color: "#3b82f6" },
  { id: "5g", label: "5G", icon: Wifi, color: "#8b5cf6" },
  { id: "satellite", label: "Satellite", icon: Satellite, color: "#f59e0b" },
  { id: "fiber", label: "Fibre", icon: Building2, color: "#10b981" }
];

// Layer types
const MAP_LAYERS = [
  { id: "schools", label: "Écoles", icon: "🏫" },
  { id: "health", label: "Centres Santé", icon: "🏥" },
  { id: "backbone", label: "Backbone", icon: "🔗" },
  { id: "infrastructure", label: "Infrastructure", icon: "📡" }
];

const PARTICIPATION_COLORS = {
  'active': '#10b981',
  'member': '#3b82f6',
  'joining': '#9ca3af'
};

// Mock recent network activity
const RECENT_ACTIVITY = [
  { country: "Mali", flag: "🇲🇱", action: "a partagé un nouveau projet", time: "Il y a 2h" },
  { country: "Kenya", flag: "🇰🇪", action: "a documenté une bonne pratique", time: "Il y a 4h" },
  { country: "Côte d'Ivoire", flag: "🇨🇮", action: "a rejoint une collaboration", time: "Hier" }
];

export const LeafletInteractiveMap = ({ agencies }: LeafletInteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);
  const loggedCountries = useRef<Set<string>>(new Set());
  const { projects } = useProjects();

  const isValidCoordinates = (coords?: [number, number]) => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
    const [lat, lng] = coords;
    return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [countryCoordinates, setCountryCoordinates] = useState<Record<string, [number, number]>>({});

  // Calculate network stats
  const totalCountries = new Set(agencies.map(a => a.country)).size;
  const activeCountries = agencies.filter(a => a.sync_status === 'synced').length;
  const totalProjects = projects?.length || 127;
  const bestPractices = 24;

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

  // Create custom marker icon with network-centric styling
  const createCustomIcon = (status: string, isPulsing: boolean = false) => {
    const color = status === 'synced' ? PARTICIPATION_COLORS.active : 
                  status === 'pending' ? PARTICIPATION_COLORS.member : 
                  PARTICIPATION_COLORS.joining;
    
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

  // Add markers to the map with enriched network-centric popups
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

      const isPulsing = agency.sync_status === 'synced';
      const icon = createCustomIcon(agency.sync_status, isPulsing);
      const participationStatus = agency.sync_status === 'synced' ? 'Pays actif' : 
                                   agency.sync_status === 'pending' ? 'Pays membre' : 'En adhésion';
      const projectCount = Math.floor(Math.random() * 15) + 1; // Mock project count per country
      const lastContribution = Math.floor(Math.random() * 7) + 1; // Mock days ago

      try {
        const marker = L.marker(coordinates, { icon })
          .addTo(map.current!);

        // Store marker reference
        markers.current.push(marker);

        // Create enriched popup content (network-centric)
        const popupContent = `
          <div style="padding: 12px; min-width: 260px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-size: 24px;">${getCountryFlag(agency.country)}</span>
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${agency.country}</h3>
                <p style="margin: 0; font-size: 11px; color: #666;">Pays membre du réseau SUTEL</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <div style="flex: 1; background: #f0fdf4; padding: 8px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #10b981;">${projectCount}</p>
                <p style="margin: 0; font-size: 10px; color: #666;">projets partagés</p>
              </div>
              <div style="flex: 1; background: #eff6ff; padding: 8px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #3b82f6;">${participationStatus === 'Pays actif' ? 'Actif' : 'Membre'}</p>
                <p style="margin: 0; font-size: 10px; color: #666;">statut</p>
              </div>
            </div>
            
            <p style="margin: 0 0 12px 0; font-size: 11px; color: #888;">
              Dernière contribution : il y a ${lastContribution} jour${lastContribution > 1 ? 's' : ''}
            </p>
            
            <div style="display: flex; gap: 8px;">
              <a href="/organizations" style="
                flex: 1;
                display: inline-block;
                padding: 8px 12px;
                background: #0B3C5D;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 11px;
                text-align: center;
              ">Voir la fiche pays</a>
              <a href="/forum" style="
                flex: 1;
                display: inline-block;
                padding: 8px 12px;
                background: #328E6E;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 11px;
                text-align: center;
              ">Contacter</a>
            </div>
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

  // Helper function to get country flag emoji
  const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
      'Sénégal': '🇸🇳', 'Mali': '🇲🇱', 'Côte d\'Ivoire': '🇨🇮', 'Ghana': '🇬🇭',
      'Nigeria': '🇳🇬', 'Burkina Faso': '🇧🇫', 'Niger': '🇳🇪', 'Togo': '🇹🇬',
      'Bénin': '🇧🇯', 'Kenya': '🇰🇪', 'Tanzanie': '🇹🇿', 'Ouganda': '🇺🇬',
      'Rwanda': '🇷🇼', 'Éthiopie': '🇪🇹', 'Cameroun': '🇨🇲', 'RDC': '🇨🇩',
      'Afrique du Sud': '🇿🇦', 'Maroc': '🇲🇦', 'Algérie': '🇩🇿', 'Tunisie': '🇹🇳',
      'Égypte': '🇪🇬', 'Zambie': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Mozambique': '🇲🇿'
    };
    return flags[country] || '🌍';
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      logger.info('Initializing Leaflet map...', { component: 'LeafletInteractiveMap' });
      
      // Create map centered on Africa
      map.current = L.map(mapContainer.current, {
        center: [0, 20],
        zoom: 3,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      });

      // Add OpenStreetMap tiles
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

      return () => {
        clearTimeout(markerTimeout);
      };

    } catch (error) {
      logger.error('Error initializing Leaflet map', error, { component: 'LeafletInteractiveMap' });
    }

    return () => {
      if (map.current) {
        logger.debug('Cleaning up map...', { component: 'LeafletInteractiveMap' });
        try {
          clearMarkers();
          map.current.eachLayer((layer) => {
            map.current!.removeLayer(layer);
          });
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

  // Active filters state
  const [activeParticipation, setActiveParticipation] = useState<string | null>(null);
  const [activeProjectType, setActiveProjectType] = useState<string | null>(null);
  const [activeTech, setActiveTech] = useState<string[]>([]);
  const [activeLayers, setActiveLayers] = useState<string[]>(["infrastructure"]);

  const toggleTech = (id: string) => {
    setActiveTech(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  return (
    <Card className="p-6">
      {/* Network-centric Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Carte du Réseau SUTEL</h3>
        </div>
        <Badge variant="outline" className="bg-primary/5">
          {totalCountries} pays membres • {totalProjects} projets partagés
        </Badge>
      </div>

      {/* Network KPIs Bar (P0 - Critical) */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Globe className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-lg font-bold text-emerald-600">{totalCountries}</p>
            <p className="text-xs text-muted-foreground">Pays membres</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-lg font-bold text-blue-600">{activeCountries}</p>
            <p className="text-xs text-muted-foreground">Actifs ce trimestre</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Briefcase className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-lg font-bold text-purple-600">{totalProjects}</p>
            <p className="text-xs text-muted-foreground">Projets partagés</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-lg font-bold text-amber-600">{bestPractices}</p>
            <p className="text-xs text-muted-foreground">Bonnes pratiques</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un pays ou un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Network-centric Filters (P0 - Restructured) */}
      <div className="mb-4 space-y-3">
        {/* Participation Filters (Priority - New) */}
        <div className="flex flex-wrap items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Participation réseau:</span>
          {PARTICIPATION_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={activeParticipation === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveParticipation(activeParticipation === filter.id ? null : filter.id)}
              className="gap-1 text-xs"
              style={activeParticipation === filter.id ? { backgroundColor: filter.color } : {}}
            >
              <filter.icon className="h-3 w-3" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Project Type Filters (New) */}
        <div className="flex flex-wrap items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Type de projets:</span>
          {PROJECT_TYPE_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={activeProjectType === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveProjectType(activeProjectType === filter.id ? null : filter.id)}
              className="text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Technology Filters (Secondary) */}
        <div className="flex flex-wrap items-center gap-2">
          <Radio className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Technologies:</span>
          {TECHNOLOGY_FILTERS.map((tech) => (
            <Button
              key={tech.id}
              variant={activeTech.includes(tech.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTech(tech.id)}
              className="gap-1 text-xs"
            >
              <tech.icon className="h-3 w-3" />
              {tech.label}
            </Button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Couches:</span>
          {MAP_LAYERS.map((layer) => (
            <Button
              key={layer.id}
              variant={activeLayers.includes(layer.id) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => toggleLayer(layer.id)}
              className="text-xs gap-1"
            >
              <span>{layer.icon}</span>
              {layer.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-border"
          style={{ minHeight: '400px' }}
        />
        
        {/* Network-centric Legend (P0) */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Pays actifs dans le réseau
          </h4>
          <div className="space-y-1">
            {PARTICIPATION_FILTERS.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: filter.color }}
                />
                <span className="text-xs text-muted-foreground">{filter.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Stats Overlay (P0 - Redesigned) */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg max-w-[200px]">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Dynamiques régionales
          </h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Projets partagés:</span>
              <span className="font-medium text-emerald-600">{totalProjects}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Collaborations:</span>
              <span className="font-medium text-blue-600">24</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Pays actifs:</span>
              <span className="font-medium text-purple-600">{activeCountries}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Panel (P1) */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg max-w-[220px]">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-success" />
            Activité récente
          </h4>
          <div className="space-y-2">
            {RECENT_ACTIVITY.map((activity, index) => (
              <div key={index} className="text-xs flex items-start gap-2">
                <span>{activity.flag}</span>
                <div>
                  <span className="font-medium">{activity.country}</span>
                  <span className="text-muted-foreground"> {activity.action}</span>
                  <p className="text-muted-foreground/70 text-[10px]">{activity.time}</p>
                </div>
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
