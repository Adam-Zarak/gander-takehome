'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Aircraft, AircraftStatus } from '@/types/aircraft';
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

export default function AircraftList({ aircraft, onStatusUpdate }: AircraftListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {aircraft.map((aircraft) => (
        <li key={aircraft.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">{aircraft.tailNumber}</p>
              <p
                className={clsx(
                  statusStyles[aircraft.status],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {aircraft.status}
              </p>
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
                            'block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left',
                            aircraft.status === status && 'font-semibold'
                          )}
                        >
                          Set {status}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
} 