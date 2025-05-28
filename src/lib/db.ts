import { Aircraft, AircraftStatus, StatusChange } from '@/types/aircraft';
import { v4 as uuidv4 } from 'uuid';

// Mock database
let aircraft: Aircraft[] = [
  {
    id: '1',
    tailNumber: 'N12345',
    model: 'Boeing 737-800',
    status: 'available',
    location: { latitude: 40.7128, longitude: -74.0060 }, // New York
  },
  {
    id: '2',
    tailNumber: 'N67890',
    model: 'Airbus A320',
    status: 'maintenance',
    location: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
  },
  {
    id: '3',
    tailNumber: 'N11223',
    model: 'Boeing 787-9',
    status: 'aog',
    location: { latitude: 41.8781, longitude: -87.6298 }, // Chicago
  },
  {
    id: '4',
    tailNumber: 'N44556',
    model: 'Airbus A321',
    status: 'available',
    location: { latitude: 29.7604, longitude: -95.3698 }, // Houston
  },
  {
    id: '5',
    tailNumber: 'N77889',
    model: 'Boeing 737-900',
    status: 'maintenance',
    location: { latitude: 47.6062, longitude: -122.3321 }, // Seattle
  },
];

let statusChanges: StatusChange[] = [];

export const db = {
  getAll: () => aircraft,
  
  getAllStatusChanges: () => {
    return statusChanges.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  getRecentStatusChanges: (limit: number = 10) => {
    return statusChanges
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  },

  updateStatus: (id: string, newStatus: AircraftStatus, reason?: string) => {
    const aircraftIndex = aircraft.findIndex(a => a.id === id);
    if (aircraftIndex === -1) return null;

    const aircraftToUpdate = aircraft[aircraftIndex];
    const previousStatus = aircraftToUpdate.status;

    // Only create a change record if the status actually changed
    if (previousStatus !== newStatus) {
      const change: StatusChange = {
        id: uuidv4(),
        aircraftId: id,
        tailNumber: aircraftToUpdate.tailNumber,
        previousStatus,
        newStatus,
        timestamp: new Date(),
        reason,
      };
      statusChanges.push(change);

      // Update the aircraft status
      aircraft[aircraftIndex] = {
        ...aircraftToUpdate,
        status: newStatus,
      };
    }

    return aircraft[aircraftIndex];
  },

  getFleetMetrics: () => {
    const total = aircraft.length;
    const available = aircraft.filter(a => a.status === 'available').length;
    const maintenance = aircraft.filter(a => a.status === 'maintenance').length;
    const aog = aircraft.filter(a => a.status === 'aog').length;

    return {
      total,
      available,
      maintenance,
      aog,
      availabilityRate: (available / total) * 100,
      maintenanceRate: (maintenance / total) * 100,
      aogRate: (aog / total) * 100,
    };
  },
}; 