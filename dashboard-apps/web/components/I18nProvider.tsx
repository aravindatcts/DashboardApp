'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { ReactNode } from 'react';
import en from '@shared/i18n/locales/en.json';
import es from '@shared/i18n/locales/es.json';
import ta from '@shared/i18n/locales/ta.json';

if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: en },
                es: { translation: es },
                ta: { translation: ta },
            },
            lng: 'en',
            fallbackLng: 'en',
            interpolation: { escapeValue: false },
        });
}

export default function I18nProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
