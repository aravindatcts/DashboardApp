'use client';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useSecurityDetails } from '@shared/hooks/useSecurityDetails';
import type { SaveStatus } from '@/types';
import styles from './SecurityDetails.module.scss';

interface SecurityDetailsHook {
    password: string;
    setPassword: (v: string) => void;
    mfaOption: string;
    setMfaOption: (v: string) => void;
    handleUpdate: () => void;
    mfaOptions: string[];
    loading: boolean;
    error: string | null;
    saveStatus: SaveStatus | null;
    clearSaveStatus: () => void;
}

export default function SecurityDetailsPage() {
    const { t } = useTranslation();
    const {
        password, setPassword,
        mfaOption, setMfaOption,
        handleUpdate, mfaOptions,
        saveStatus, clearSaveStatus,
    } = useSecurityDetails() as SecurityDetailsHook;

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t('Security Details')}</h1>
                {saveStatus && (
                    <div className={`${styles.statusBanner} ${saveStatus.ok ? styles.statusBannerOk : styles.statusBannerErr}`}>
                        <span>{saveStatus.message}</span>
                        <button className={styles.statusDismiss} onClick={clearSaveStatus} aria-label="Dismiss">✕</button>
                    </div>
                )}
                <div className={styles.card}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('Password')}</label>
                        <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className={styles.btnSecondary}>{t('Change Password')}</button>
                    </div>
                    <div className={styles.inputGroup}>
                        <p className={styles.sectionTitle}>{t('Multi-Factor Authentication (MFA)')}</p>
                        <p className={styles.subtext}>{t('Select your preferred MFA method:')}</p>
                        <div className={styles.mfaList}>
                            {mfaOptions.map(opt => (
                                <button
                                    key={opt}
                                    className={`${styles.mfaOption} ${mfaOption === opt ? styles.mfaOptionActive : ''}`}
                                    onClick={() => setMfaOption(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className={styles.btnPrimary} onClick={handleUpdate}>{t('Update Security Settings')}</button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
