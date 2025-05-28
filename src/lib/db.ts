import { Aircraft, AircraftStatus, StatusChange } from '@/types/aircraft';
import { v4 as uuidv4 } from 'uuid';

// Mock database using a Map for O(1) lookups
class AircraftDB {
  private aircraft: Map<string, Aircraft>;
  private statusChanges: StatusChange[];

  constructor() {
    this.aircraft = new Map(mockAircraft.map(a => [a.id, a]));
    this.statusChanges = [];
  }

  getAll(): Aircraft[] {
    return Array.from(this.aircraft.values());
  }

  getById(id: string): Aircraft | undefined {
    return this.aircraft.get(id);
  }

  getAllStatusChanges(): StatusChange[] {
    return this.statusChanges.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getRecentStatusChanges(limit: number = 10): StatusChange[] {
    return this.statusChanges
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  updateStatus(id: string, newStatus: AircraftStatus, reason?: string): Aircraft | null {
    const aircraft = this.aircraft.get(id);
    if (!aircraft) return null;

    const previousStatus = aircraft.status;

    // Only create a change record if the status actually changed
    if (previousStatus !== newStatus) {
      const change: StatusChange = {
        id: uuidv4(),
        aircraftId: id,
        tailNumber: aircraft.tailNumber,
        previousStatus,
        newStatus,
        timestamp: new Date(),
        reason,
      };
      this.statusChanges.push(change);

      // Update the aircraft status
      const updatedAircraft = {
        ...aircraft,
        status: newStatus,
      };
      this.aircraft.set(id, updatedAircraft);
      return updatedAircraft;
    }

    return null;
  }

  getFleetMetrics(): {
    total: number;
    available: number;
    maintenance: number;
    aog: number;
    availabilityRate: number;
    maintenanceRate: number;
    aogRate: number;
  } {
    const total = this.aircraft.size;
    const available = Array.from(this.aircraft.values()).filter(a => a.status === 'available').length;
    const maintenance = Array.from(this.aircraft.values()).filter(a => a.status === 'maintenance').length;
    const aog = Array.from(this.aircraft.values()).filter(a => a.status === 'aog').length;

    return {
      total,
      available,
      maintenance,
      aog,
      availabilityRate: (available / total) * 100,
      maintenanceRate: (maintenance / total) * 100,
      aogRate: (aog / total) * 100,
    };
  }
}

// Sample data
const mockAircraft: Aircraft[] = [
  {
    id: '1',
    tailNumber: 'N123GA',
    model: 'Boeing 737-800',
    status: 'available',
    location: { latitude: 40.7128, longitude: -74.0060 }, // New York
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    tailNumber: 'N456GA',
    model: 'Airbus A320',
    status: 'maintenance',
    location: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    tailNumber: 'N789GA',
    model: 'Embraer E190',
    status: 'available',
    location: { latitude: 41.8781, longitude: -87.6298 }, // Chicago
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    tailNumber: 'N321GA',
    model: 'Boeing 737-800',
    status: 'aog',
    location: { latitude: 25.7617, longitude: -80.1918 }, // Miami
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    tailNumber: 'N654GA',
    model: 'Airbus A320',
    status: 'available',
    location: { latitude: 47.6062, longitude: -122.3321 }, // Seattle
    updatedAt: new Date().toISOString(),
  },
];

// Export a singleton instance
export const db = new AircraftDB(); 