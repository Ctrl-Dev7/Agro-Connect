'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, TrendingUp, TrendingDown, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Signal {
  crop_id: number;
  crop_name: string;
  signal_type: 'SELL' | 'HOLD';
  change_pct: number;
  confidence_score: number;
  current_price: number;
  future_price: number;
  mandi_name: string;
}

export default function SellHoldIndicator() {
  const { t } = useTranslation();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSignals() {
      try {
        const res = await fetch('/api/predictions/signals');
        if (res.ok) {
          const data = await res.json();
          setSignals(data);
        }
      } catch (err) {
        console.error('Failed to load AL signals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSignals();
  }, []);

  if (loading) {
    return (
      <div className="animate-in stagger-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="section-header" style={{ marginBottom: 'var(--space-md)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🧠 AI Recommendations</h2>
        </div>
        <div className="grid-2">
          {[1, 2].map((i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-lg)' }}>
              <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 12 }}></div>
              <div className="skeleton" style={{ height: 16, width: '80%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (signals.length === 0) return null;

  return (
    <div className="animate-in stagger-2" style={{ marginBottom: 'var(--space-xl)' }}>
      <div className="section-header" style={{ marginBottom: 'var(--space-md)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Brain size={20} color="var(--color-primary)" />
          {t('aiRecommendations', 'AI Recommendations')}
        </h2>
        <Link href="/dashboard/predictions" className="btn btn-sm btn-ghost">
          {t('viewDetailedGraphs', 'Detailed Graphs')} <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid-2">
        {signals.map((signal) => {
          const isSell = signal.signal_type === 'SELL';
          // Using success color (green) for HOLD since holding means expected profit increase
          // Or wait: "Sell output" means taking the profit. The brief says: 
          // SELL -> prices peaking (green).
          // HOLD -> expected to rise (red).
          // Wait, 'SELL' generally means green (good time to act), 'HOLD' implies wait/amber.
          // Let's use var(--color-success) for SELL and var(--color-warning) for HOLD.
          
          const accentColor = isSell ? 'var(--color-success)' : 'var(--color-warning)';
          const bgColor = isSell ? 'rgba(5, 150, 105, 0.05)' : 'rgba(217, 119, 6, 0.05)';
          const Icon = isSell ? TrendingDown : TrendingUp;

          return (
            <div key={signal.crop_id} className="card" style={{ 
                borderLeft: `4px solid ${accentColor}`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
              <div style={{ padding: 'var(--space-md) var(--space-lg)', background: bgColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ 
                    padding: 6, 
                    background: '#fff', 
                    borderRadius: 'var(--radius-sm)', 
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <Icon size={18} color={accentColor} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {isSell ? 'SELL' : 'HOLD'} {signal.crop_name.toUpperCase()}
                  </h3>
                </div>
                <div className="badge" style={{ 
                  background: 'var(--color-bg-secondary)', 
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <RefreshCw size={12} />
                  {signal.confidence_score}% Confidence
                </div>
              </div>
              
              <div className="card-body" style={{ padding: 'var(--space-lg)' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {isSell 
                    ? `Prices are peaking at ₹${signal.current_price.toLocaleString('en-IN')}/qtl. Expected to drop by ${signal.change_pct}% over the next 7 days in ${signal.mandi_name}.` 
                    : `Currently ₹${signal.current_price.toLocaleString('en-IN')}/qtl. Expected to rise by ${signal.change_pct}% to ₹${signal.future_price.toLocaleString('en-IN')}/qtl over the next week.`
                  }
                </p>
                
                <Link href="/dashboard/predictions" className="btn btn-sm btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  {isSell ? 'List on Marketplace' : 'View Prediction Graph'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
