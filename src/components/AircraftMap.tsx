'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Aircraft } from '@/types/aircraft';
import type { LatLngBoundsExpression } from 'leaflet';

interface AircraftMapProps {
  aircraft: Aircraft[];
}

const statusColors = {
  available: '#22c55e',
  maintenance: '#eab308',
  aog: '#ef4444',
};

// Dynamically import the map components with no SSR
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-lg overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    )
  }
);

export default function AircraftMap({ aircraft }: AircraftMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[500px] w-full rounded-lg overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    );
  }

  const bounds: LatLngBoundsExpression = aircraft.map((a) => [
    a.location.latitude,
    a.location.longitude,
  ]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
      <MapWithNoSSR aircraft={aircraft} bounds={bounds} />
    </div>
  );
} 