import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Icon } from '@iconify/react';

interface ZoneConfig {
  id: string;
  region: string;
  subregion: string;
  timeZone: string;
  icon: string;
  tzCode: string;
}

const ZONES: ZoneConfig[] = [
  {
    id: 'cet',
    region: 'Central European Time',
    subregion: 'Europe (Paris, Berlin, Rome)',
    timeZone: 'Europe/Paris',
    icon: 'material-symbols:public-rounded',
    tzCode: 'CET',
  },
  {
    id: 'et',
    region: 'US Eastern Time',
    subregion: 'Americas (New York, Boston)',
    timeZone: 'America/New_York',
    icon: 'material-symbols:map-rounded',
    tzCode: 'ET',
  },
];

function getUtcOffset(timeZone: string, date: Date): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    }).formatToParts(date);
    const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value;
    if (offsetPart) {
      const match = offsetPart.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
      if (match) {
        const sign = match[1];
        const hours = parseInt(match[2], 10);
        const mins = match[3] ? parseInt(match[3], 10) : 0;
        return mins ? `UTC${sign}${hours}:${match[3]}` : `UTC${sign}${hours}`;
      }
    }
  } catch {
    // fallback if Intl longOffset is not supported
  }
  return '';
}

function getTimeData(zone: ZoneConfig) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    timeZone: zone.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const date = now.toLocaleDateString('en-US', {
    timeZone: zone.timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const parts = Intl.DateTimeFormat('en-US', { timeZone: zone.timeZone, timeZoneName: 'short' }).formatToParts(now);
  const rawTz = parts.find(p => p.type === 'timeZoneName')?.value || '';

  // Canonicalize timezone display (e.g. CET/CEST or EST/EDT instead of generic GMT offsets)
  let tzName = rawTz;
  if (zone.id === 'cet') {
    tzName = rawTz.includes('Summer') || rawTz === 'CEST' || rawTz === 'GMT+2' ? 'CEST' : 'CET';
  } else if (zone.id === 'et') {
    tzName = rawTz.includes('Daylight') || rawTz === 'EDT' || rawTz === 'GMT-4' ? 'EDT' : 'EST';
  }

  const utcOffset = getUtcOffset(zone.timeZone, now);

  return { time, date, tzName, utcOffset };
}

function TimeZoneBlock({ zone }: { zone: ZoneConfig }): JSX.Element {
  const [data, setData] = useState(() => getTimeData(zone));

  useEffect(() => {
    const timer = setInterval(() => {
      setData(getTimeData(zone));
    }, 10000);
    return () => clearInterval(timer);
  }, [zone]);

  return (
    <div className="flex flex-col gap-5 py-2 sm:flex-row sm:items-center sm:justify-between sm:py-4">
      {/* Left: Icon, Region, Hubs & Date */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md dark:shadow-none">
          <Icon icon={zone.icon} className="text-3xl text-white" />
        </div>
        <div>
          <h4 className="m-0 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{zone.region}</h4>
          <p className="dark:text-gray-400 m-0 text-xs font-medium text-gray-500 sm:text-sm">{zone.subregion}</p>
          <p className="m-0 mt-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{data.date}</p>
        </div>
      </div>

      {/* Right: Live Digital Clock & Timezone Badge */}
      <div className="flex items-baseline justify-between sm:flex-col sm:items-end sm:justify-center">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {data.time}
          </span>
          <span className="shadow-xs rounded-lg bg-purple-100 px-2.5 py-1 font-mono text-xs font-bold text-[#892CA0] dark:bg-white/10 dark:text-purple-300 dark:shadow-none sm:text-sm">
            {data.tzName}
          </span>
        </div>
        <span className="dark:text-gray-400 mt-1 text-xs font-medium text-gray-500">{data.utcOffset}</span>
      </div>
    </div>
  );
}

function DateTimeBox(): JSX.Element {
  return (
    <div className="w-full rounded-3xl bg-white p-8 shadow-xl shadow-purple-900/10 dark:bg-[#1e172a] dark:shadow-none sm:p-12">
      <BrowserOnly fallback={<div className="h-80 animate-pulse rounded-2xl bg-purple-100/50 dark:bg-white/5" />}>
        {() => (
          <>
            <TimeZoneBlock zone={ZONES[0]} />
            <div className="my-8 h-px w-full bg-gray-100 dark:bg-white/10 sm:my-10" />
            <TimeZoneBlock zone={ZONES[1]} />
          </>
        )}
      </BrowserOnly>
    </div>
  );
}

export default DateTimeBox;
