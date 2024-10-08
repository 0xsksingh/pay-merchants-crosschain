"use client";

import { useState, useEffect } from 'react';

export default function TabSet() {
  const [onConfigurePage, setOnConfigurePage] = useState(false);

  useEffect(() => {
    setOnConfigurePage(window.location.href.endsWith('/preference'));
  }, []);

  const tabs = [
    { name: 'PaytoMerchant', href: '/', current: !onConfigurePage },
    { name: 'Attestation', href: '/create-attestation', current: false },
    { name: 'Set Preference', href: '/preference', current: onConfigurePage },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="m-auto max-w-md">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-60 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current)?.name}>
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
          {tabs.map((tab, tabIdx) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
              )}
              aria-current={tab.current ? 'page' : undefined}>
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(tab.current ? 'bg-indigo-500' : 'bg-transparent', 'absolute inset-x-0 bottom-0 h-0.5')}
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
