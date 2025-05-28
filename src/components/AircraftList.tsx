'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Aircraft, AircraftStatus } from '@/types/aircraft';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface AircraftListProps {
  aircraft: Aircraft[];
  onStatusUpdate: (id: string, status: AircraftStatus) => void;
}

const statusStyles = {
  available: 'bg-green-50 text-green-700 ring-green-600/20',
  maintenance: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  aog: 'bg-red-50 text-red-700 ring-red-600/20',
};

const statusIcons = {
  available: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  maintenance: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  aog: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
};

export default function AircraftList({ aircraft, onStatusUpdate }: AircraftListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      <AnimatePresence>
        {aircraft.map((aircraft) => (
          <motion.li
            key={aircraft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between gap-x-6 py-5 hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors duration-200"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">{aircraft.tailNumber}</p>
                <div
                  className={clsx(
                    statusStyles[aircraft.status],
                    'rounded-md whitespace-nowrap mt-0.5 px-2 py-1 text-xs font-medium ring-1 ring-inset flex items-center gap-1'
                  )}
                >
                  {statusIcons[aircraft.status]}
                  {aircraft.status}
                </div>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">{aircraft.model}</p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">
                  {aircraft.location.latitude.toFixed(4)}, {aircraft.location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {(['available', 'maintenance', 'aog'] as const).map((status) => (
                      <Menu.Item key={status}>
                        {({ active }) => (
                          <button
                            onClick={() => onStatusUpdate(aircraft.id, status)}
                            className={clsx(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left flex items-center gap-2',
                              aircraft.status === status && 'font-semibold'
                            )}
                          >
                            {statusIcons[status]}
                            Set {status}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
} 