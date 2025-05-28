'use client';

import { useState, useEffect } from 'react';
import { Aircraft, AircraftFilter } from '@/types/aircraft';
import { db } from '@/lib/db';
import AircraftList from './AircraftList';
import AircraftMap from './AircraftMap';
import FilterBar from './FilterBar';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(db.getAll());
  const [filters, setFilters] = useState<AircraftFilter>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    <div className="min-h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg shadow-indigo-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Aircraft Fleet Management
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 flex items-center gap-2"
          >
            <div className="flex items-center gap-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{readyAircraft.length}</span> of {aircraft.length} aircraft ready to fly
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-4 py-6 sm:px-0"
          >
            <FilterBar filters={filters} onFilterChange={setFilters} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Location Map
                </h2>
                <AircraftMap aircraft={filteredAircraft} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 