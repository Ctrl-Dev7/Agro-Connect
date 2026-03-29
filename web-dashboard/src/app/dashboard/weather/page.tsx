'use client';

import { useState, useEffect } from 'react';
import {
  ThermometerSun, CloudRain, Wind, Droplets, AlertTriangle, Info,
  Thermometer, CloudSun, Leaf
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
    soil_moisture?: number;
    temp_min?: number;
    precip_24h?: number;
  };
  location: string;
  alerts: WeatherAlert[];
  hourly?: {
    time: string[];
    temperature: number[];
    humidity: number[];
    precipitation: number[];
  };
}

export default function WeatherPage() {
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
        console.error('Weather page load error:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--color-text-tertiary)', fontWeight: 600, fontSize: '1rem' }}>{t('loadingWeather', 'Loading weather...')}</div>
      </div>
    );
  }

  const formatHour = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.getHours().toString().padStart(2, '0') + ':00';
    } catch { return '--'; }
  };

  return (
    <div>
      {/* Hero: Current Weather */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-xs)' }}>
              {data.location}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <ThermometerSun size={56} color="var(--color-warning)" />
              <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1 }}>
                {Math.round(data.current.temp)}°C
              </span>
            </div>
            {data.current.temp_min !== undefined && (
              <div style={{ marginTop: 'var(--space-xs)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Tonight's Low: <strong>{data.current.temp_min}°C</strong>
              </div>
            )}
          </div>

          {/* Irrigation Badge */}
          <div style={{
            background: data.current.irrigation_suggestion.includes('Skip') ? 'var(--color-danger)' : 'var(--color-success)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 24,
            fontSize: '1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Droplets size={18} />
            {data.current.irrigation_suggestion}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {[
          { icon: <CloudRain size={24} color="var(--color-primary)" />, label: t('rain', 'Rain') + ' %', value: data.current.rain_chance + '%' },
          { icon: <Wind size={24} color="var(--color-primary)" />, label: t('wind', 'Wind'), value: Math.round(data.current.wind) + ' km/h' },
          { icon: <Droplets size={24} color="var(--color-primary)" />, label: t('humidity', 'Humidity'), value: Math.round(data.current.humidity) + '%' },
          { icon: <Leaf size={24} color="var(--color-success)" />, label: t('soilMoisture', 'Soil Moisture'), value: (data.current.soil_moisture || '--') + '%' },
          { icon: <Thermometer size={24} color="var(--color-warning)" />, label: t('tempMin', 'Min Temperature'), value: (data.current.temp_min || '--') + '°C' },
          { icon: <CloudRain size={24} color="var(--color-info)" />, label: t('precipitation24h', '24h Precipitation'), value: (data.current.precip_24h || 0) + ' mm' },
        ].map((m, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-lg)' }}>
            <div style={{ padding: 10, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              {m.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 24-Hour Forecast — Horizontal Chart */}
      {data.hourly && data.hourly.time.length > 0 && (() => {
        const temps = data.hourly!.temperature;
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const range = maxTemp - minTemp || 1;

        return (
          <div className="card" style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <CloudSun size={20} color="var(--color-info)" />
                {t('hourlyForecast', '24-Hour Temperature Forecast')}
              </h2>
            </div>

            {/* Horizontal Bar Chart */}
            <div style={{ padding: 'var(--space-lg)', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, minWidth: 800, height: 200, paddingBottom: 30, position: 'relative' }}>
                {temps.map((temp, i) => {
                  const pct = ((temp - minTemp) / range) * 100;
                  const barHeight = Math.max(pct, 8);
                  const hasRain = data.hourly!.precipitation[i] > 0;
                  const isHot = temp > 35;
                  const isCold = temp < 15;
                  const barColor = isHot ? 'var(--color-danger)' : isCold ? 'var(--color-info)' : 'var(--color-primary)';
                  const hour = formatHour(data.hourly!.time[i]);

                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
                      {/* Temp label */}
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: barColor }}>{Math.round(temp)}°</span>
                      {/* Temp bar */}
                      <div style={{
                        width: '100%', maxWidth: 28,
                        height: barHeight + '%',
                        minHeight: 12,
                        background: barColor,
                        borderRadius: '4px 4px 0 0',
                        opacity: 0.85,
                        position: 'relative',
                        transition: 'height 0.3s ease',
                      }}>
                        {/* Rain overlay dot */}
                        {hasRain && (
                          <div style={{
                            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                            width: 8, height: 8, borderRadius: '50%', background: '#3B82F6',
                            boxShadow: '0 0 4px rgba(59,130,246,0.5)'
                          }} />
                        )}
                      </div>
                      {/* Hour label */}
                      <span style={{ fontSize: '0.6rem', color: 'var(--color-text-tertiary)', position: 'absolute', bottom: -24, whiteSpace: 'nowrap' }}>
                        {hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-primary)', display: 'inline-block' }} /> {t('normal', 'Normal')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-danger)', display: 'inline-block' }} /> {t('hotAbove35', 'Hot (>35°C)')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-info)', display: 'inline-block' }} /> {t('coolBelow15', 'Cool (<15°C)')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }} /> {t('rainDetected', 'Rain detected')}
                </span>
              </div>
            </div>

            {/* Detailed Data Table (collapsible) */}
            <details style={{ borderTop: '1px solid var(--color-border)' }}>
              <summary style={{ padding: 'var(--space-md) var(--space-lg)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                {t('viewDetailedHourly', 'View Detailed Hourly Data')}
              </summary>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-secondary)' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t('time', 'Time')}</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t('tempC', 'Temp (°C)')}</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t('humidityPct', 'Humidity (%)')}</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t('rainMm', 'Rain (mm)')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.hourly!.time.map((timeStr, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{formatHour(timeStr)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'center', color: data.hourly!.temperature[i] > 35 ? 'var(--color-danger)' : 'var(--color-text-primary)', fontWeight: 700 }}>
                          {Math.round(data.hourly!.temperature[i])}°
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'center', color: data.hourly!.humidity[i] > 80 ? 'var(--color-warning)' : 'var(--color-text-primary)' }}>
                          {Math.round(data.hourly!.humidity[i])}%
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'center', color: data.hourly!.precipitation[i] > 0 ? 'var(--color-primary)' : 'var(--color-text-tertiary)', fontWeight: data.hourly!.precipitation[i] > 0 ? 700 : 400 }}>
                          {data.hourly!.precipitation[i] > 0 ? data.hourly!.precipitation[i].toFixed(1) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        );
      })()}

      {/* All Crop Warnings */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <AlertTriangle size={20} color="var(--color-warning)" />
            {t('cropSpecificWarnings', 'Crop-Specific Warnings')}
          </h2>
        </div>
        <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {data.alerts.map((alert, idx) => {
            let alertColor = 'var(--color-success)';
            let bgColor = '#EAFBF0';
            let Icon = Info;
            if (alert.urgency === 'CRITICAL') { alertColor = 'var(--color-danger)'; bgColor = '#FFEAEA'; Icon = AlertTriangle; }
            else if (alert.urgency === 'HIGH') { alertColor = 'var(--color-warning)'; bgColor = '#FFF4E5'; Icon = AlertTriangle; }

            return (
              <div key={idx} style={{
                background: bgColor,
                borderLeft: "4px solid " + alertColor,
                padding: 'var(--space-md) var(--space-lg)',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                gap: 'var(--space-md)',
                alignItems: 'flex-start'
              }}>
                <Icon size={20} color={alertColor} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {alert.alert}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: alertColor, marginTop: 4, fontWeight: 700 }}>
                    TARGET: {alert.related_crops?.toUpperCase() || 'ALL CROPS'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
