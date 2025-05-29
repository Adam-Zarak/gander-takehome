'use client';

import { StatusChange } from '@/types/aircraft';
import { motion } from 'framer-motion';

interface RecentChangesProps {
  changes: StatusChange[];
}

const statusColors = {
  available: 'text-green-600',
  maintenance: 'text-yellow-600',
  aog: 'text-red-600',
};

const statusDescriptions = {
  available: 'Ready for flight operations',
  maintenance: 'Undergoing scheduled maintenance',
  aog: 'Aircraft on Ground - Immediate attention required',
};

export default function RecentChanges({ changes }: RecentChangesProps) {
  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
      'minutes'
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Recent Status Changes
      </h2>
      <div className="space-y-4">
        {changes.map((change) => (
          <motion.div
            key={change.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-4 border-indigo-500 pl-4 py-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {change.tailNumber}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status changed from{' '}
                  <span className={statusColors[change.previousStatus]}>
                    {change.previousStatus}
                  </span>{' '}
                  to{' '}
                  <span className={statusColors[change.newStatus]}>
                    {change.newStatus}
                  </span>
                </p>
                {change.reason && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Reason: {change.reason}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(new Date(change.timestamp))}
              </span>
            </div>
          </motion.div>
        ))}
        {changes.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No recent changes
          </p>
        )}
      </div>
    </div>
  );
} 