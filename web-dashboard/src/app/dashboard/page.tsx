'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  CloudSun,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sprout,
  IndianRupee,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface CropPrice {
  crop_id: number;
  crop_name: string;
  latest_price: number;
  prev_price: number;
  change_pct: number;
}

interface MandiCount {
  state_code: string;
  count: number;
}

interface Advisory {
  advisory_id: number;
  title_en: string;
  advisory_type: string;
  urgency: string;
}

interface PriceHistory {
  date: string;
  price: number;
}

// Haversine distance helper
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [totalMandis, setTotalMandis] = useState(0);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  
  // Localized Dashboard Context
  const [localMandi, setLocalMandi] = useState<{ id: number; name: string }>({ id: 47, name: 'Delhi' });
  const [primaryCrop, setPrimaryCrop] = useState<{ id: number; name: string }>({ id: 1, name: 'Wheat' });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: t('goodMorning', 'Good Morning'), icon: <Sun size={28} className="greeting-icon morning" /> };
    } else if (hour < 17) {
      return { text: t('goodAfternoon', 'Good Afternoon'), icon: <Sun size={28} className="greeting-icon afternoon" /> };
    } else {
      return { text: t('goodEvening', 'Good Evening'), icon: <Sunset size={28} className="greeting-icon evening" /> };
    }
  };

  // Fetch user name
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        const firstName = user.user_metadata.first_name || user.user_metadata.name || '';
        setUserName(firstName);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadDashboardData(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn('Geolocation blocked or error, falling back to Delhi defaults.');
          loadDashboardData();
        }
      );
    } else {
      loadDashboardData();
    }
  }, []);

  async function loadDashboardData(userLat?: number, userLon?: number) {
    try {
      let targetMandi = { id: 47, name: 'Delhi' };
      
      // 1. Geolocate Nearest Mandi
      if (userLat && userLon) {
        // [BACKGROUND SYNC] Auto-update user profile with real-time location
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const uType = user.user_metadata?.user_type || 'FARMER';
          const table = uType === 'FARMER' ? 'u_farmer_profile' : 'u_buyer_profile';
          await supabase.from(table).upsert({ 
            user_id: user.id, 
            primary_location_lat: userLat, 
            primary_location_lon: userLon 
          }, { onConflict: 'user_id' });
        }

        const { data: mandis } = await supabase.from('c_mandis').select('mandi_id, mandi_name, latitude, longitude');
        if (mandis && mandis.length > 0) {
          let nearest = mandis[0];
          let minDist = getDistance(userLat, userLon, nearest.latitude, nearest.longitude);
          for (const m of mandis) {
            const d = getDistance(userLat, userLon, m.latitude, m.longitude);
            if (d < minDist) {
              minDist = d;
              nearest = m;
            }
          }
          targetMandi = { id: nearest.mandi_id, name: nearest.mandi_name };
        }
      }
      setLocalMandi(targetMandi);

      // 2. Fetch Top 6 Active Crops at this local mandi
      const { data: recentPrices } = await supabase
        .from('p_daily_market_prices')
        .select('crop_id, c_crops(crop_name_en)')
        .eq('mandi_id', targetMandi.id)
        .order('date', { ascending: false })
        .limit(200);

      let localCrops: { id: number; name: string }[] = [];
      if (recentPrices && recentPrices.length > 0) {
        const uniqueCropMap = new Map();
        for (const row of recentPrices) {
          if (!uniqueCropMap.has(row.crop_id)) {
            const cropData = row.c_crops as any;
            uniqueCropMap.set(row.crop_id, cropData?.crop_name_en || 'Unknown');
          }
        }
        localCrops = Array.from(uniqueCropMap.entries()).slice(0, 6).map(([id, name]) => ({ id, name }));
      }

      // Fallback to global crops if empty local market
      if (localCrops.length === 0) {
        const { data: crops } = await supabase
          .from('c_crops')
          .select('crop_id, crop_name_en')
          .in('crop_id', [1, 2, 7, 8, 9, 4]);
        localCrops = crops ? crops.map(c => ({ id: c.crop_id, name: c.crop_name_en })) : [];
      }

      const mainCrop = localCrops[0] || { id: 1, name: 'Wheat' };
      setPrimaryCrop(mainCrop);

      // 3. Fetch Prices for these specific crops (globally or locally)
      const pricePromises = localCrops.map(async (crop) => {
        const { data: latest } = await supabase
          .from('p_daily_market_prices')
          .select('price_per_quintal, date')
          .eq('crop_id', crop.id)
          .eq('mandi_id', targetMandi.id)
          .order('date', { ascending: false })
          .limit(2);

        const latestPrice = latest?.[0]?.price_per_quintal || 0;
        const prevPrice = latest?.[1]?.price_per_quintal || latestPrice;
        const changePct = prevPrice > 0 ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;

        return {
          crop_id: crop.id,
          crop_name: crop.name,
          latest_price: latestPrice,
          prev_price: prevPrice,
          change_pct: Math.round(changePct * 100) / 100,
        };
      });
      const prices = await Promise.all(pricePromises);
      setCropPrices(prices);

      // Fetch mandi count
      const { count } = await supabase.from('c_mandis').select('*', { count: 'exact', head: true });
      setTotalMandis(count || 0);

      // Fetch recent advisories
      const { data: advData } = await supabase.from('a_advisories').select('advisory_id, title_en, advisory_type, urgency').order('urgency', { ascending: true }).limit(4);
      setAdvisories(advData || []);

      // 4. Fetch localized Price History for the primary local crop
      const { data: histData } = await supabase
        .from('p_daily_market_prices')
        .select('date, price_per_quintal')
        .eq('crop_id', mainCrop.id)
        .eq('mandi_id', targetMandi.id)
        .order('date', { ascending: true })
        .limit(30);

      if (histData) {
        setPriceHistory(histData.map(d => ({
          date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          price: d.price_per_quintal,
        })));
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const urgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'badge-danger';
      case 'HIGH': return 'badge-warning';
      case 'MEDIUM': return 'badge-info';
      default: return 'badge-success';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'Pest Control': return '🐛';
      case 'Irrigation': return '💧';
      case 'Fertilization': return '🌱';
      case 'Weather': return '⛈️';
      case 'Storage': return '📦';
      case 'Market Intelligence': return '📊';
      case 'Soil Health': return '🧪';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div>
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: 48, height: 48 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '80%', height: 28 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid-2-1">
          <div className="card" style={{ height: 320 }}>
            <div className="skeleton" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="card" style={{ height: 320 }}>
            <div className="skeleton" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  const greeting = getGreeting();

  return (
    <div>
      {/* Greeting Banner */}
      <div className="greeting-banner">
        <div className="greeting-content">
          {greeting.icon}
          <div>
            <h2 className="greeting-text">
              {greeting.text}{userName ? ', ' : ''}<span className="greeting-name">{userName}</span> 👋
            </h2>
            <p className="greeting-subtext">
              {t('dashboardSubtitle', "Here's what's happening with your farm today")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card animate-in stagger-1">
          <div className="stat-icon green">
            <Sprout size={24} />
          </div>
          <div className="stat-info">
            <h4>{t('cropsTracked')}</h4>
            <div className="stat-value">{cropPrices.length}</div>
            <div className="stat-change up">
              <ArrowUpRight size={12} /> {t('activePredictions')}
            </div>
          </div>
        </div>

        <div className="stat-card animate-in stagger-2">
          <div className="stat-icon orange">
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <h4>{primaryCrop.name} (Avg)</h4>
            <div className="stat-value">
              ₹{cropPrices.find(c => c.crop_id === primaryCrop.id)?.latest_price?.toLocaleString('en-IN') || '—'}
            </div>
            {(() => {
              const main = cropPrices.find(c => c.crop_id === primaryCrop.id);
              if (!main) return null;
              return (
                <div className={`stat-change ${main.change_pct >= 0 ? 'up' : 'down'}`}>
                  {main.change_pct >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(main.change_pct)}%
                </div>
              );
            })()}
          </div>
        </div>

        <div className="stat-card animate-in stagger-3">
          <div className="stat-icon blue">
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <h4>{t('marketsListed')}</h4>
            <div className="stat-value">{totalMandis}</div>
            <div className="stat-change up">
              <ArrowUpRight size={12} /> {t('acrossIndia')}
            </div>
          </div>
        </div>

        <div className="stat-card animate-in stagger-4">
          <div className="stat-icon brown">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h4>{t('activeAdvisories')}</h4>
            <div className="stat-value">{advisories.length}</div>
            <div className="stat-change">
              <Minus size={12} /> {t('updatedToday')}
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Advisories Row */}
      <div className="grid-2-1" style={{ marginBottom: 24 }}>
        {/* Price Chart */}
        <div className="card card-accent">
          <div className="card-header">
            <h3>📈 Price History ({primaryCrop.name} - {localMandi.name})</h3>
            <Link href="/dashboard/predictions" className="btn btn-sm btn-outline">
              {t('viewAll')}
            </Link>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B5E20" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#757575' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E0E0E0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#757575' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    fontSize: 13,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}/qtl`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#1B5E20"
                  strokeWidth={2.5}
                  fill="url(#colorPrice)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#1B5E20', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advisories Panel */}
        <div className="card card-accent-warning">
          <div className="card-header">
            <h3>⚠️ {t('recentAdvisories')}</h3>
            <Link href="/dashboard/advisories" className="btn btn-sm btn-outline">
              {t('viewAll')}
            </Link>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {advisories.map((adv) => (
                <div
                  key={adv.advisory_id}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }}>
                    {typeIcon(adv.advisory_type)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
                      {adv.title_en}
                    </div>
                    <span className={`badge ${urgencyBadge(adv.urgency)}`}>
                      {t(`urgency.${adv.urgency}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crop Prices Table */}
      <div className="card">
        <div className="card-header">
          <h3>💰 {t('latestPrices')}</h3>
          <Link href="/dashboard/predictions" className="btn btn-sm btn-primary">
            <TrendingUp size={14} /> {t('predictedPrices')}
          </Link>
        </div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th style={{ textAlign: 'right' }}>Latest Price (₹/qtl)</th>
                <th style={{ textAlign: 'right' }}>Previous (₹/qtl)</th>
                <th style={{ textAlign: 'right' }}>Change</th>
                <th style={{ textAlign: 'center' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {cropPrices.map((cp) => (
                <tr key={cp.crop_id}>
                  <td style={{ fontWeight: 600 }}>
                    <span style={{ marginRight: 8 }}>
                      {cp.crop_id === 1 ? '🌾' : cp.crop_id === 2 ? '🍚' : cp.crop_id === 7 ? '🧅' : cp.crop_id === 8 ? '🍅' : cp.crop_id === 9 ? '🥔' : '🌿'}
                    </span>
                    {cp.crop_name}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>
                    ₹{cp.latest_price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                    ₹{cp.prev_price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={cp.change_pct >= 0 ? 'trend-up' : 'trend-down'} style={{ fontWeight: 600 }}>
                      {cp.change_pct >= 0 ? '+' : ''}{cp.change_pct}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {cp.change_pct > 0.5 ? (
                      <TrendingUp size={18} className="trend-up" />
                    ) : cp.change_pct < -0.5 ? (
                      <TrendingDown size={18} className="trend-down" />
                    ) : (
                      <Minus size={18} className="trend-stable" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
