import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'My Videos',
      href: '/dashboard/videos',
      icon: VideoCameraIcon,
      current: location.pathname.startsWith('/dashboard/videos'),
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: CloudArrowUpIcon,
      current: location.pathname === '/upload',
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: ChartBarIcon,
      current: location.pathname === '/dashboard/analytics',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Cog6ToothIcon,
      current: location.pathname === '/dashboard/settings',
    },
  ];

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Quick stats or info section */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Quick Stats
            </h3>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Videos</span>
                <span className="font-medium text-gray-900">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium text-gray-900">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};