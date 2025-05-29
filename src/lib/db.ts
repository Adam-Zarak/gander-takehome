'use client';

import { Aircraft, StatusChange } from '@/types/aircraft';
import { v4 as uuidv4 } from 'uuid';

interface FleetMetrics {
  total: number;
  available: number;
  maintenance: number;
  aog: number;
  availabilityRate: number;
  maintenanceRate: number;
  aogRate: number;
}

let aircraftData: Aircraft[] = [];
const statusChangeHistory: StatusChange[] = [];

export const db = {
  // Initialize the database with aircraft data
  init: (aircraft: Aircraft[]) => {
    aircraftData = aircraft;
  },

  // Get all aircraft
  getAll: (): Aircraft[] => {
    return aircraftData;
  },

  // Get a single aircraft by id
  getById: (id: string): Aircraft | undefined => {
    return aircraftData.find(ac => ac.id === id);
  },

  // Get fleet metrics
  getFleetMetrics: (): FleetMetrics => {
    const total = aircraftData.length;
    const available = aircraftData.filter(ac => ac.status === 'available').length;
    const maintenance = aircraftData.filter(ac => ac.status === 'maintenance').length;
    const aog = aircraftData.filter(ac => ac.status === 'aog').length;

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

  // Update aircraft status
  updateStatus: (id: string, newStatus: Aircraft['status']): void => {
    const aircraft = aircraftData.find(ac => ac.id === id);
    if (aircraft) {
      const previousStatus = aircraft.status;
      aircraft.status = newStatus;
      
      // Record the status change
      statusChangeHistory.unshift({
        id: uuidv4(),
        aircraftId: aircraft.id,
        tailNumber: aircraft.tailNumber,
        previousStatus,
        newStatus,
        timestamp: new Date(),
      });
    }
  },

  // Get recent status changes
  getRecentStatusChanges: (limit: number = 5): StatusChange[] => {
    return statusChangeHistory.slice(0, limit);
  },

  // Search aircraft by query
  search: (query: string): Aircraft[] => {
    const normalizedQuery = query.toLowerCase();
    return aircraftData.filter(aircraft =>
      aircraft.tailNumber.toLowerCase().includes(normalizedQuery) ||
      aircraft.model.toLowerCase().includes(normalizedQuery) ||
      aircraft.status.toLowerCase().includes(normalizedQuery)
    );
  },
}; 