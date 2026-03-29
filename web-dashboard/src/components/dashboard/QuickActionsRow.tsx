'use client';

import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  TrendingUp, 
  FileText, 
  ScanLine, 
  CloudSun, 
  MessagesSquare 
} from 'lucide-react';
import Link from 'next/link';

export default function QuickActionsRow() {
  const { t } = useTranslation();

  const actions = [
    { labelKey: 'qaCrop', fallback: '+ Crop', icon: PlusCircle, href: '/dashboard/farm/add-crop', color: 'var(--color-primary)' },
    { labelKey: 'qaMarket', fallback: 'Market', icon: TrendingUp, href: '/dashboard/market', color: 'var(--color-info)' },
    { labelKey: 'qaScheme', fallback: 'Scheme', icon: FileText, href: '/dashboard/schemes', color: 'var(--color-warning)' },
    { labelKey: 'qaDisease', fallback: 'Disease', icon: ScanLine, href: '/dashboard/disease-scanner', color: 'var(--color-danger)' },
    { labelKey: 'qaWeather', fallback: 'Weather', icon: CloudSun, href: '/dashboard/weather', color: 'var(--color-primary)' },
    { labelKey: 'qaExpert', fallback: 'Expert', icon: MessagesSquare, href: '/dashboard/forum', color: 'var(--color-success)' },
  ];

  return (
    <div style={{ marginTop: 'var(--space-2xl)' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
        {t('quickActions', 'Quick Actions')}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: 'var(--space-md)',
      }}>
        {actions.map((act) => {
          const IconComponent = act.icon;
          return (
            <Link 
              key={act.labelKey} 
              href={act.href}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-lg) var(--space-sm)',
                textDecoration: 'none',
                gap: 12,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{
                background: "var(--color-bg-secondary)",
                padding: 12,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: act.color
              }}>
                <IconComponent size={24} />
              </div>
              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                color: 'var(--color-text-secondary)',
                textAlign: 'center'
              }}>
                {t(act.labelKey, act.fallback)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
