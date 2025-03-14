'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/config/i18n';
import { notFoundConfig } from '@/config/pages/not-found.config';
import './not-found.css';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const { locale } = useTranslation();
  const texts = notFoundConfig[locale] || notFoundConfig.es;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">{texts.title}</h1>
        <h2 className="not-found-subtitle">{texts.subtitle}</h2>
        <p className="not-found-message">{texts.message}</p>
        <Link href="/" className="not-found-button">
          {texts.button}
        </Link>
      </div>
    </div>
  );
}
