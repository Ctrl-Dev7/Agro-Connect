'use client';

import { useTranslation } from 'react-i18next';
import WeatherAlertCard from './WeatherAlertCard';
import PriorityActionsCard from './PriorityActionsCard';

export default function ImmediateActionBar() {
  const { t } = useTranslation();
  return (
    <div className="animate-in stagger-1" style={{ marginBottom: 'var(--space-xl)' }}>
      <div className="section-header" style={{ marginBottom: 'var(--space-md)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('immediateActions', '⚡ Immediate Actions')}</h2>
      </div>
      <div className="grid-2">
        <PriorityActionsCard />
        <WeatherAlertCard />
      </div>
    </div>
  );
}
