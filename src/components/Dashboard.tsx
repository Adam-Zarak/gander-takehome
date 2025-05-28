'use client';

import { useState, useEffect } from 'react';
import { Aircraft, AircraftFilter } from '@/types/aircraft';
import { db } from '@/lib/db';
import AircraftList from './AircraftList';
import AircraftMap from './AircraftMap';
import FilterBar from './FilterBar';
import { motion } from 'framer-motion';
import RecentChanges from './RecentChanges';
import FleetMetrics from './FleetMetrics';

export default function Dashboard() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(db.getAll());
  const [filters, setFilters] = useState<AircraftFilter>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [recentChanges, setRecentChanges] = useState(db.getRecentStatusChanges());

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      setRecentChanges(db.getRecentStatusChanges());
    }
  };

  const metrics = db.getFleetMetrics();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <FleetMetrics metrics={metrics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main content area - 8 columns */}
              <div className="lg:col-span-8 space-y-8">
                <FilterBar filters={filters} onFilterChange={setFilters} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Aircraft List
                    </h2>
                    <AircraftList 
                      aircraft={filteredAircraft} 
                      onStatusUpdate={handleStatusUpdate} 
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6"
                  >
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Location Map
                    </h2>
                    <div className="h-[calc(100%-2rem)]">
                      <AircraftMap aircraft={filteredAircraft} />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Sidebar - 4 columns */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-4"
              >
                <RecentChanges changes={recentChanges} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 