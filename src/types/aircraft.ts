export type AircraftStatus = 'available' | 'aog' | 'maintenance';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Aircraft {
  id: string;
  tailNumber: string;
  model: string;
  status: AircraftStatus;
  location: Coordinates;
  updatedAt: string;
}

export interface AircraftFilter {
  tailNumber?: string;
  model?: string;
  status?: AircraftStatus;
} 