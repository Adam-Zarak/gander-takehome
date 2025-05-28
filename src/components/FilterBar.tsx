'use client';

import { AircraftFilter, AircraftStatus } from '@/types/aircraft';

interface FilterBarProps {
  filters: AircraftFilter;
  onFilterChange: (filters: AircraftFilter) => void;
}

const statusOptions: AircraftStatus[] = ['available', 'maintenance', 'aog'];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleChange = (field: keyof AircraftFilter, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor="tailNumber" className="block text-sm font-medium text-gray-700">
          Tail Number
        </label>
        <input
          type="text"
          id="tailNumber"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={filters.tailNumber || ''}
          onChange={(e) => handleChange('tailNumber', e.target.value)}
          placeholder="Search by tail number..."
        />
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
          Model
        </label>
        <input
          type="text"
          id="model"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={filters.model || ''}
          onChange={(e) => handleChange('model', e.target.value)}
          placeholder="Search by model..."
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value as AircraftStatus)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 