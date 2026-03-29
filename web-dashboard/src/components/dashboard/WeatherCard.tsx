'use client';

import { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  ThermometerSun,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherAlert {
  alert: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  related_crops: string;
}

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    wind: number;
    rain_chance: number;
    irrigation_suggestion: string;
  };
  location: string;
  alerts: WeatherAlert[];
}

export default function WeatherCard() {
  const { t } = useTranslation();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Weather load error:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading || !data) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
        <div style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}>Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {data.location} Weather
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
            <ThermometerSun size={48} color="var(--color-warning)" />
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {Math.round(data.current.temp)}°
            </span>
          </div>
        </div>
        
        {/* Irrigation suggestion badge */}
        <div style={{
          background: data.current.irrigation_suggestion.includes('Skip') ? 'var(--color-danger)' : 'var(--color-success)',
          color: 'var(--color-bg-primary)',
          padding: '6px 12px',
          borderRadius: 20,
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <Droplets size={14} />
          {data.current.irrigation_suggestion}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-md)', 
        padding: 'var(--space-md) 0',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CloudRain size={20} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Rain Chance</div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{data.current.rain_chance}%</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wind size={20} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Wind</div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{Math.round(data.current.wind)} km/h</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplets size={20} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Humidity</div>
            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{Math.round(data.current.humidity)}%</div>
          </div>
        </div>
      </div>

      {/* Actionable Alerts Engine */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>CROP WARNINGS</h4>
        {data.alerts.map((alert, idx) => {
          
          let alertColor = 'var(--color-primary)';
          let bgColor = 'var(--color-bg-secondary)';
          let Icon = Info;
          
          if (alert.urgency === 'CRITICAL') {
            alertColor = 'var(--color-danger)';
            bgColor = '#FFEAEA'; // Soft red
            Icon = AlertTriangle;
          } else if (alert.urgency === 'HIGH') {
            alertColor = 'var(--color-warning)';
            bgColor = '#FFF4E5'; // Soft amber
            Icon = AlertTriangle;
          } else if (alert.urgency === 'MEDIUM') {
            alertColor = 'var(--color-success)';
            bgColor = '#EAFBF0'; // Soft green
          }

          return (
            <div key={idx} style={{
              background: bgColor,
              borderLeft: "4px solid " + alertColor,
              padding: 'var(--space-md)',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              gap: 'var(--space-sm)',
              alignItems: 'flex-start'
            }}>
              <Icon size={18} color={alertColor} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {alert.alert}
                </div>
                <div style={{ fontSize: '0.75rem', color: alertColor, marginTop: 4, fontWeight: 700 }}>
                  TARGET: {alert.related_crops?.toUpperCase() || 'ALL CROPS'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
