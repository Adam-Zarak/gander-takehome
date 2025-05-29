'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Aircraft } from '@/types/aircraft';
import { motion } from 'framer-motion';
import * as turf from '@turf/turf';

// You'll need to replace this with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWRhbXphcmFrIiwiYSI6ImNtYjhtMnhkbjBudTYyaXE1OWwxbW9zMDcifQ.kCSJGrCwPWda-BpEj6wX6Q';

interface AircraftMapProps {
  aircraft: Aircraft[];
}

// Remove the destinations constant and replace with operational ranges
const operationalRanges = {
  available: 1000, // 1000km operational radius
  maintenance: 100, // 100km radius for limited movement
  aog: 0, // No movement radius
};

const statusColors = {
  available: '#22c55e',
  maintenance: '#eab308',
  aog: '#ef4444',
};

export default function AircraftMap({ aircraft }: AircraftMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const circlesRef = useRef<{ [key: string]: string }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3,
    });

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl());

    // Wait for map style to load
    mapInstance.on('style.load', () => {
      setMapLoaded(true);
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update markers and circles
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapLoaded) return;

    // Store current markers and circles to remove only if needed
    const currentMarkers = { ...markersRef.current };
    const currentCircles = { ...circlesRef.current };
    const newMarkers: typeof markersRef.current = {};
    const newCircles: typeof circlesRef.current = {};

    // Add or update markers and circles
    aircraft.forEach(ac => {
      try {
        // Handle marker
        const markerElement = document.createElement('div');
        markerElement.className = 'aircraft-marker';
        markerElement.style.width = '24px';
        markerElement.style.height = '24px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.border = `2px solid ${statusColors[ac.status]}`;
        markerElement.style.backgroundColor = `${statusColors[ac.status]}20`;
        markerElement.style.cursor = 'pointer';

        // Create or update marker
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([ac.location.longitude, ac.location.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="text-sm">
                <p class="font-semibold">${ac.tailNumber}</p>
                <p class="text-gray-600">${ac.model}</p>
                <p class="capitalize">${ac.status}</p>
                ${ac.status !== 'aog' ? `<p class="text-sm mt-1">Operational range: ${operationalRanges[ac.status]}km</p>` : ''}
              </div>`
            )
          );

        // Remove from current markers so it won't be deleted
        delete currentMarkers[ac.id];
        
        // Add to map and store reference
        marker.addTo(mapInstance);
        newMarkers[ac.id] = marker;

        // Handle operational range circle
        if (ac.status !== 'aog') {
          const radius = operationalRanges[ac.status];
          const circleId = `circle-${ac.id}`;
          const center: [number, number] = [ac.location.longitude, ac.location.latitude];
          const circle = turf.circle(center, radius, { steps: 64, units: 'kilometers' });

          // Remove from current circles so it won't be deleted
          delete currentCircles[ac.id];

          // Update or create circle layers
          if (mapInstance.getSource(circleId)) {
            (mapInstance.getSource(circleId) as mapboxgl.GeoJSONSource).setData(circle);
            
            // Update circle colors
            mapInstance.setPaintProperty(circleId, 'fill-color', statusColors[ac.status]);
            mapInstance.setPaintProperty(`${circleId}-outline`, 'line-color', statusColors[ac.status]);
          } else {
            mapInstance.addSource(circleId, {
              type: 'geojson',
              data: circle
            });

            mapInstance.addLayer({
              id: circleId,
              type: 'fill',
              source: circleId,
              paint: {
                'fill-color': statusColors[ac.status],
                'fill-opacity': 0.1
              }
            });

            mapInstance.addLayer({
              id: `${circleId}-outline`,
              type: 'line',
              source: circleId,
              paint: {
                'line-color': statusColors[ac.status],
                'line-width': 1,
                'line-opacity': 0.3
              }
            });
          }

          newCircles[ac.id] = circleId;
        }
      } catch (error) {
        console.error('Error updating aircraft visualization:', error);
      }
    });

    // Remove old markers
    Object.values(currentMarkers).forEach(marker => marker.remove());

    // Remove old circles
    Object.keys(currentCircles).forEach(id => {
      const circleId = currentCircles[id];
      const outlineId = `${circleId}-outline`;
      
      if (mapInstance.getLayer(outlineId)) {
        mapInstance.removeLayer(outlineId);
      }
      if (mapInstance.getLayer(circleId)) {
        mapInstance.removeLayer(circleId);
      }
      if (mapInstance.getSource(circleId)) {
        mapInstance.removeSource(circleId);
      }
    });

    // Update refs
    markersRef.current = newMarkers;
    circlesRef.current = newCircles;
  }, [aircraft, mapLoaded]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[400px] rounded-lg overflow-hidden"
    >
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .mapboxgl-popup-content {
          @apply bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700;
        }
        .mapboxgl-popup-tip {
          @apply border-t-gray-200 dark:border-t-gray-700;
        }
        .mapboxgl-ctrl-group {
          @apply bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700;
        }
        .mapboxgl-ctrl button {
          @apply text-gray-700 dark:text-gray-300;
        }
      `}</style>
    </motion.div>
  );
} 