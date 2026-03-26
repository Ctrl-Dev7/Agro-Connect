'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Navigation, Filter, Search, ExternalLink } from 'lucide-react';

interface Mandi {
  mandi_id: number;
  mandi_name: string;
  state_code: string;
  district_name: string;
  latitude: number;
  longitude: number;
}

const stateNames: Record<string, string> = {
  MH: 'Maharashtra', UP: 'Uttar Pradesh', MP: 'Madhya Pradesh', RJ: 'Rajasthan',
  GJ: 'Gujarat', PB: 'Punjab', HR: 'Haryana', KA: 'Karnataka', TN: 'Tamil Nadu',
  AP: 'Andhra Pradesh', TS: 'Telangana', WB: 'West Bengal', BR: 'Bihar',
  DL: 'Delhi', CG: 'Chhattisgarh', OR: 'Odisha', AS: 'Assam',
};

export default function MandisPage() {
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [filtered, setFiltered] = useState<Mandi[]>([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    loadMandis();
  }, []);

  useEffect(() => {
    let result = mandis;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m =>
        m.mandi_name.toLowerCase().includes(s) ||
        m.district_name?.toLowerCase().includes(s)
      );
    }
    if (stateFilter) {
      result = result.filter(m => m.state_code === stateFilter);
    }
    setFiltered(result);
  }, [search, stateFilter, mandis]);

  async function loadMandis() {
    const { data } = await supabase
      .from('c_mandis')
      .select('*')
      .order('mandi_name');

    if (data) {
      setMandis(data);
      setFiltered(data);
      const uniqueStates = [...new Set(data.map(m => m.state_code))].sort();
      setStates(uniqueStates);
    }
    setLoading(false);
  }

  function openDirections(lat: number, lon: number) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  }

  if (loading) {
    return (
      <div className="grid-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card" style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
              <input
                className="form-input"
                placeholder="Search mandis by name or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <select
                className="form-select"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="">All States</option>
                {states.map(s => (
                  <option key={s} value={s}>{stateNames[s] || s}</option>
                ))}
              </select>
            </div>
            <div className="badge badge-info" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              <MapPin size={14} />
              {filtered.length} markets found
            </div>
          </div>
        </div>
      </div>

      {/* Mandi Grid */}
      <div className="grid-3">
        {filtered.map((mandi, i) => (
          <div key={mandi.mandi_id} className="card animate-in" style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
            <div className="card-body" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>
                    {mandi.mandi_name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    <MapPin size={13} />
                    {mandi.district_name}, {stateNames[mandi.state_code] || mandi.state_code}
                  </div>
                </div>
                <span className="badge badge-success">{mandi.state_code}</span>
              </div>

              <div style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: 12,
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
              }}>
                📍 {mandi.latitude.toFixed(4)}°N, {mandi.longitude.toFixed(4)}°E
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => openDirections(mandi.latitude, mandi.longitude)}
                >
                  <Navigation size={14} />
                  Directions
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  aria-label="Open Map externally"
                  onClick={() => window.open(`https://www.google.com/maps/@${mandi.latitude},${mandi.longitude},15z`, '_blank')}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <MapPin size={48} />
          <p style={{ marginTop: 12 }}>No markets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
