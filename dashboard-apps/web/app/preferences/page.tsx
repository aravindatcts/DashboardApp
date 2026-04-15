'use client';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { usePreferences } from '@shared/hooks/usePreferences';
import type { SaveStatus } from '@/types';
import styles from './Preferences.module.scss';

interface PreferencesHook {
    prefs: Record<string, string>;
    handleChange: (field: string, value: string) => void;
    handleUpdate: () => void;
    loading: boolean;
    error: string | null;
    saveStatus: SaveStatus | null;
    clearSaveStatus: () => void;
}

export default function PreferencesPage() {
    const { t } = useTranslation();
    const { prefs, handleChange, handleUpdate, saveStatus, clearSaveStatus } = usePreferences() as PreferencesHook;

    const makeSelect = (field: string, options: string[]) => (
        <select className={styles.select} value={prefs[field]} onChange={e => handleChange(field, e.target.value)}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t('Preferences')}</h1>
                {saveStatus && (
                    <div className={`${styles.statusBanner} ${saveStatus.ok ? styles.statusBannerOk : styles.statusBannerErr}`}>
                        <span>{saveStatus.message}</span>
                        <button className={styles.statusDismiss} onClick={clearSaveStatus} aria-label="Dismiss">✕</button>
                    </div>
                )}
                <div className={styles.card}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('Language Preference')}</label>
                        {makeSelect('language', ['English', 'Español', 'தமிழ் (Tamil)'])}
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('Email Preferences')}</label>
                        {makeSelect('emailPrefs', ['All Communications', 'Important Updates Only', 'None'])}
                    </div>
                    <div className={styles.inputGroup}>
                        <p className={styles.sectionTitle}>{t('Document Delivery Preferences')}</p>
                        <label className={styles.label}>{t('Explanation of Benefit')}</label>
                        {makeSelect('deliveryEob', ['Paper & Online', 'Online Only'])}
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('US Tax Form 1095B')}</label>
                        {makeSelect('deliveryTax', ['Paper & Online', 'Online Only'])}
                    </div>
                    <button className={styles.btnPrimary} onClick={handleUpdate}>{t('Update')}</button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
