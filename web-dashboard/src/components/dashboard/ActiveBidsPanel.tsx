'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingCart, CornerDownRight, Plus } from 'lucide-react';
import Link from 'next/link';

interface ListingData {
  listing_id: number;
  crop_name: string;
  quantity: number;
  unit: string;
  listed_price: number;
  item_type: string;
  status: string;
  time_ago: string;
}

const EMOJI_MAP: Record<string, string> = {
  'Wheat': '🌾', 'Rice (Paddy)': '🍚', 'Maize': '🌽', 'Soybean': '🌿',
  'Chickpea (Gram/Chana)': '🫘', 'Coffee': '☕', 'Onion': '🧅', 'Tomato': '🍅',
  'Potato': '🥔', 'Red Chilli': '🌶️', 'Groundnut': '🥜', 'Green Pea': '🫑',
};

export default function ActiveBidsPanel() {
  const { t } = useTranslation();
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch('/api/marketplace/my-bids');
        if (res.ok) {
          const data = await res.json();
          setListings(data);
        }
      } catch (err) {
        console.error('Failed to load active listings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ padding: 'var(--space-2xl) var(--space-xl)', textAlign: 'center', background: 'var(--color-bg-secondary)' }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px' }}></div>
        <div className="skeleton" style={{ width: '40%', height: 20, margin: '0 auto 8px' }}></div>
        <div className="skeleton" style={{ width: '60%', height: 14, margin: '0 auto' }}></div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="card" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 'var(--space-2xl) var(--space-xl)',
        border: '1.5px dashed var(--color-border)', background: 'var(--color-bg-secondary)',
      }}>
        <Package size={32} color="var(--color-text-tertiary)" style={{ marginBottom: 12 }} />
        <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
          {t('noActiveListings', 'No Active Listings')}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', margin: '0 0 16px', lineHeight: 1.5 }}>
          {t('noActiveListingsDesc', 'Start selling your produce on the marketplace!')}
        </p>
        <Link href="/dashboard/marketplace" className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> {t('sellYourProduce', 'Sell Your Produce')}
        </Link>
      </div>
    );
  }

  const INR = new Intl.NumberFormat('en-IN');

  return (
    <div className="card">
      <div className="card-header" style={{ paddingBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingCart size={20} color="var(--color-info)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('myActiveListings', 'My Active Listings')}</h3>
        </div>
        <div className="badge badge-success">{listings.length} {t('active', 'Active')}</div>
      </div>

      <div className="card-body" style={{ paddingTop: 0, paddingBottom: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {listings.map((listing) => {
            const emoji = EMOJI_MAP[listing.crop_name] || '📦';
            return (
              <div key={listing.listing_id} style={{
                padding: 'var(--space-md)',
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {listing.crop_name}
                      </h4>
                      <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                        {listing.quantity} {listing.unit}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{INR.format(listing.listed_price)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                      {t('per', 'per')} {listing.unit}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{listing.status}</span>
                    <span className="badge" style={{ fontSize: '0.7rem' }}>{listing.item_type}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{listing.time_ago}</span>
                </div>
              </div>
            );
          })}
        </div>

        <Link href="/dashboard/marketplace" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--color-primary)',
          fontWeight: 500, textDecoration: 'none'
        }}>
          {t('viewAllMarketplace', 'View all marketplace listings')} <CornerDownRight size={14} />
        </Link>
      </div>
    </div>
  );
}
