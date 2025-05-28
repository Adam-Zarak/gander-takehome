export type AircraftStatus = 'available' | 'maintenance' | 'aog';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Aircraft {
  id: string;
  tailNumber: string;
  model: string;
  status: AircraftStatus;
  location: Location;
}

export interface AircraftFilter {
  tailNumber?: string;
  model?: string;
  status?: AircraftStatus;
}

export interface StatusChange {
  id: string;
  aircraftId: string;
  tailNumber: string;
  previousStatus: AircraftStatus;
  newStatus: AircraftStatus;
  timestamp: Date;
  reason?: string;
} 