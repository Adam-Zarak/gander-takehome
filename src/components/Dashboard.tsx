'use client';

import { useState } from 'react';
import { Aircraft, AircraftFilter } from '@/types/aircraft';
import { db } from '@/lib/db';
import AircraftList from './AircraftList';
import AircraftMap from './AircraftMap';
import FilterBar from './FilterBar';

export default function Dashboard() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(db.getAll());
  const [filters, setFilters] = useState<AircraftFilter>({});

  const readyAircraft = aircraft.filter(a => a.status === 'available');

  const filteredAircraft = aircraft.filter(a => {
    if (filters.tailNumber && !a.tailNumber.toLowerCase().includes(filters.tailNumber.toLowerCase())) {
      return false;
    }
    if (filters.model && !a.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    if (filters.status && a.status !== filters.status) {
      return false;
    }
    return true;
  });

  const handleStatusUpdate = (id: string, status: Aircraft['status']) => {
    const updatedAircraft = db.updateStatus(id, status);
    if (updatedAircraft) {
      setAircraft(db.getAll());
    }
  };

  return (
    <div className="min-h-full">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Aircraft Fleet Management
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {readyAircraft.length} of {aircraft.length} aircraft ready to fly
          </p>
        </div>
      </div>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <FilterBar filters={filters} onFilterChange={setFilters} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Aircraft List</h2>
                <AircraftList 
                  aircraft={filteredAircraft} 
                  onStatusUpdate={handleStatusUpdate} 
                />
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Location Map</h2>
                <AircraftMap aircraft={filteredAircraft} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 