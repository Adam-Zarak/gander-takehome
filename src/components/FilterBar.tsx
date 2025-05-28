'use client';

import { AircraftFilter, AircraftStatus } from '@/types/aircraft';
import { motion } from 'framer-motion';

interface FilterBarProps {
  filters: AircraftFilter;
  onFilterChange: (filters: AircraftFilter) => void;
}

const statusOptions: AircraftStatus[] = ['available', 'maintenance', 'aog'];

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleChange = (field: keyof AircraftFilter, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
              </svg>
              Tail Number
            </div>
          </label>
          <motion.input
            whileFocus="focus"
            variants={inputVariants}
            type="text"
            id="tailNumber"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
            value={filters.tailNumber || ''}
            onChange={(e) => handleChange('tailNumber', e.target.value)}
            placeholder="Search by tail number..."
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Model
            </div>
          </label>
          <motion.input
            whileFocus="focus"
            variants={inputVariants}
            type="text"
            id="model"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
            value={filters.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="Search by model..."
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Status
            </div>
          </label>
          <motion.select
            whileFocus="focus"
            variants={inputVariants}
            id="status"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value as AircraftStatus)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </motion.select>
        </div>
      </div>
    </motion.div>
  );
} 