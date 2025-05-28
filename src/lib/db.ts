import { Aircraft } from '@/types/aircraft';

// Mock database using a Map for O(1) lookups
class AircraftDB {
  private aircraft: Map<string, Aircraft>;

  constructor() {
    this.aircraft = new Map(mockAircraft.map(a => [a.id, a]));
  }

  getAll(): Aircraft[] {
    return Array.from(this.aircraft.values());
  }

  getById(id: string): Aircraft | undefined {
    return this.aircraft.get(id);
  }

  updateStatus(id: string, status: Aircraft['status']): Aircraft | undefined {
    const aircraft = this.aircraft.get(id);
    if (!aircraft) return undefined;

    const updatedAircraft = {
      ...aircraft,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.aircraft.set(id, updatedAircraft);
    return updatedAircraft;
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