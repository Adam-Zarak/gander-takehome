'use client';

import { motion } from 'framer-motion';

interface FleetMetricsProps {
  metrics: {
    total: number;
    available: number;
    maintenance: number;
    aog: number;
    availabilityRate: number;
    maintenanceRate: number;
    aogRate: number;
  };
}

const MetricCard = ({ title, value, description, color }: {
  title: string;
  value: string | number;
  description?: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 ${color}`}
  >
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    {description && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    )}
  </motion.div>
);

export default function FleetMetrics({ metrics }: FleetMetricsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Fleet Performance Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Aircraft"
          value={metrics.total}
          description="Total fleet size"
          color="border-indigo-500"
        />
        <MetricCard
          title="Available"
          value={`${metrics.available} (${metrics.availabilityRate.toFixed(1)}%)`}
          description="Ready for operations"
          color="border-green-500"
        />
        <MetricCard
          title="In Maintenance"
          value={`${metrics.maintenance} (${metrics.maintenanceRate.toFixed(1)}%)`}
          description="Scheduled maintenance"
          color="border-yellow-500"
        />
        <MetricCard
          title="AOG"
          value={`${metrics.aog} (${metrics.aogRate.toFixed(1)}%)`}
          description="Requires immediate attention"
          color="border-red-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fleet Availability Trend</h3>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${metrics.availabilityRate}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Target: 85%</span>
          <span className={`font-medium ${
            metrics.availabilityRate >= 85 ? 'text-green-600' : 'text-yellow-600'
          }`}>
            Current: {metrics.availabilityRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
} 