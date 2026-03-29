'use client';

import { FileText, ExternalLink, CheckCircle, IndianRupee, Shield, Leaf, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const schemes = [
  {
    name: 'PM-Kisan Samman Nidhi',
    nameHi: 'पीएम-किसान सम्मान निधि',
    description: 'Direct income support of ₹6,000/year to all farmer families in three equal instalments.',
    eligibility: 'All landholding farmer families with cultivable land.',
    benefit: '₹6,000/year',
    icon: IndianRupee,
    color: 'var(--color-success)',
    bgColor: '#EAFBF0',
    link: 'https://pmkisan.gov.in/',
    status: 'Active',
  },
  {
    name: 'Kisan Credit Card (KCC)',
    nameHi: 'किसान क्रेडिट कार्ड',
    description: 'Provides affordable credit to farmers for crop production, post-harvest expenses, and allied activities at subsidized interest rates.',
    eligibility: 'All farmers, fishermen, and animal husbandry farmers.',
    benefit: 'Up to ₹3 Lakh at 4% interest',
    icon: Landmark,
    color: 'var(--color-info)',
    bgColor: '#EFF6FF',
    link: 'https://www.pmkisan.gov.in/KCC.aspx',
    status: 'Active',
  },
  {
    name: 'PM Fasal Bima Yojana (PMFBY)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना',
    description: 'Crop insurance scheme providing financial support in case of crop failure due to natural calamities, pests, and diseases.',
    eligibility: 'All farmers growing notified crops in notified areas.',
    benefit: 'Premium: 2% Kharif, 1.5% Rabi',
    icon: Shield,
    color: 'var(--color-warning)',
    bgColor: '#FFF4E5',
    link: 'https://pmfby.gov.in/',
    status: 'Active',
  },
  {
    name: 'Soil Health Card Scheme',
    nameHi: 'मृदा स्वास्थ्य कार्ड योजना',
    description: 'Provides soil health cards to farmers with crop-wise recommendations for nutrients and fertilizers to improve soil quality.',
    eligibility: 'All farmers across India.',
    benefit: 'Free soil testing & recommendations',
    icon: Leaf,
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    link: 'https://soilhealth.dac.gov.in/',
    status: 'Active',
  },
  {
    name: 'e-NAM (National Agriculture Market)',
    nameHi: 'ई-नाम (राष्ट्रीय कृषि बाजार)',
    description: 'Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.',
    eligibility: 'All farmers, traders, and FPOs.',
    benefit: 'Better prices via transparent bidding',
    icon: FileText,
    color: 'var(--color-primary)',
    bgColor: '#ECFDF5',
    link: 'https://enam.gov.in/',
    status: 'Active',
  },
];

export default function SchemesPage() {
  const { t } = useTranslation();
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <FileText size={24} color="var(--color-primary)" />
          {t('govtSchemesTitle', 'Government Schemes for Farmers')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          {t('govtSchemesSubtitle', 'Explore central and state government schemes to maximize your benefits.')}
        </p>
      </div>

      {/* Scheme Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {schemes.map((scheme, idx) => {
          const Icon = scheme.icon;
          return (
            <div key={idx} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-lg)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Icon */}
                <div style={{
                  width: 56, height: 56, minWidth: 56, borderRadius: 'var(--radius-md)',
                  background: scheme.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={28} color={scheme.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{scheme.name}</h3>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle size={12} style={{ marginRight: 3 }} />
                      {scheme.status}
                    </span>
                  </div>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 12px' }}>
                    {scheme.description}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-xl)', fontSize: '0.85rem', flexWrap: 'wrap', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t('eligibility', 'Eligibility')}: </span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{scheme.eligibility}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>{t('benefit', 'Benefit')}: </span>
                      <span style={{ color: scheme.color, fontWeight: 700 }}>{scheme.benefit}</span>
                    </div>
                  </div>

                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <ExternalLink size={14} /> {t('visitPortal', 'Visit Official Portal')}
                  </a>
                </div>
              </div>

              {/* Watermark */}
              <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.04, pointerEvents: 'none' }}>
                <Icon size={120} color={scheme.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
