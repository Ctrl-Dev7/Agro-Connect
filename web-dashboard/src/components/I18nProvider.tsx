'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import React, { useEffect, useState } from 'react';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Prevent hydration mismatch by rendering children after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load language from localStorage if available
    const savedLng = localStorage.getItem('agro_lang');
    if (savedLng) {
      i18n.changeLanguage(savedLng);
    }
  }, []);

  if (!mounted) {
    // Optionally return a minimal loader or invisible children during SSR
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
