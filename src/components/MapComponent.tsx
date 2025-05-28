'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Aircraft } from '@/types/aircraft';
import L from 'leaflet';
import type { LatLngBoundsExpression } from 'leaflet';

interface MapComponentProps {
  aircraft: Aircraft[];
  bounds: LatLngBoundsExpression;
}

const statusColors = {
  available: '#22c55e',
  maintenance: '#eab308',
  aog: '#ef4444',
};

// Create custom aircraft icons for each status
const createAircraftIcon = (status: keyof typeof statusColors) => L.divIcon({
  className: 'custom-aircraft-icon',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${statusColors[status]}" class="w-8 h-8 drop-shadow-md" style="transform: rotate(45deg);">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const statusIcons = {
  available: createAircraftIcon('available'),
  maintenance: createAircraftIcon('maintenance'),
  aog: createAircraftIcon('aog'),
};

export default function MapComponent({ aircraft, bounds }: MapComponentProps) {
  // Fix for Leaflet map container in Next.js
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: '100%', width: '100%' }}
      zoom={4}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {aircraft.map((aircraft) => (
        <Marker
          key={aircraft.id}
          position={[aircraft.location.latitude, aircraft.location.longitude]}
          icon={statusIcons[aircraft.status]}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{aircraft.tailNumber}</p>
              <p>{aircraft.model}</p>
              <p
                className="mt-1 flex items-center gap-1"
                style={{ color: statusColors[aircraft.status] }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: statusColors[aircraft.status] }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: statusColors[aircraft.status] }}></span>
                </span>
                {aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 