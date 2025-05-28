'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Aircraft } from '@/types/aircraft';
import L from 'leaflet';

interface AircraftMapProps {
  aircraft: Aircraft[];
}

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const statusColors = {
  available: '#22c55e',
  maintenance: '#eab308',
  aog: '#ef4444',
};

export default function AircraftMap({ aircraft }: AircraftMapProps) {
  // Calculate map bounds based on aircraft locations
  const bounds = L.latLngBounds(
    aircraft.map((a) => [a.location.latitude, a.location.longitude])
  );

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
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
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
            icon={icon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{aircraft.tailNumber}</p>
                <p>{aircraft.model}</p>
                <p
                  className="mt-1"
                  style={{ color: statusColors[aircraft.status] }}
                >
                  {aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 