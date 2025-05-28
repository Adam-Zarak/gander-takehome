import { Aircraft, StatusChange } from '@/types/aircraft';

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects (like location)
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        // Escape quotes and handle strings with commas
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function prepareAircraftDataForExport(aircraft: Aircraft[]) {
  return aircraft.map(({ id, tailNumber, model, status, location }) => ({
    'Tail Number': tailNumber,
    Model: model,
    Status: status.charAt(0).toUpperCase() + status.slice(1),
    Latitude: location.latitude,
    Longitude: location.longitude,
  }));
}

export function prepareStatusChangesForExport(changes: StatusChange[]) {
  return changes.map(({ tailNumber, previousStatus, newStatus, timestamp, reason }) => ({
    'Tail Number': tailNumber,
    'Previous Status': previousStatus.charAt(0).toUpperCase() + previousStatus.slice(1),
    'New Status': newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
    Timestamp: new Date(timestamp).toLocaleString(),
    Reason: reason || 'N/A',
  }));
} 