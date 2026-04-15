'use client';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useMemberForm } from '@shared/hooks/useMemberForm';
import type { SaveStatus } from '@/types';
import styles from './MemberInformation.module.scss';

interface Field {
    key: string;
    label: string;
    type?: string;
}

interface MemberFormHook {
    formData: Record<string, string>;
    isEditing: boolean;
    setIsEditing: (v: boolean) => void;
    handleChange: (field: string, value: string) => void;
    handleUpdate: () => void;
    loading: boolean;
    error: string | null;
    saveStatus: SaveStatus | null;
    clearSaveStatus: () => void;
}

export default function MemberInformationPage() {
    const { t } = useTranslation();
    const {
        formData, isEditing, setIsEditing,
        handleChange, handleUpdate,
        saveStatus, clearSaveStatus,
    } = useMemberForm() as MemberFormHook;

    const fields: Field[] = [
        { key: 'name', label: t('Name'), type: 'text' },
        { key: 'email', label: t('Email Address'), type: 'email' },
        { key: 'phone', label: t('Phone Number'), type: 'tel' },
        { key: 'billingAddress', label: t('Billing Address') },
        { key: 'mailingAddress', label: t('Mailing Address') },
    ];

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>{t('Member Information')}</h1>
                    {!isEditing && (
                        <button className={styles.editBtn} onClick={() => setIsEditing(true)}>{t('Edit')}</button>
                    )}
                </div>
                {saveStatus && (
                    <div className={`${styles.statusBanner} ${saveStatus.ok ? styles.statusBannerOk : styles.statusBannerErr}`}>
                        <span>{saveStatus.message}</span>
                        <button className={styles.statusDismiss} onClick={clearSaveStatus} aria-label="Dismiss">✕</button>
                    </div>
                )}
                <div className={styles.card}>
                    {fields.map(f => (
                        <div key={f.key} className={styles.inputGroup}>
                            <label className={styles.label}>{f.label}</label>
                            {isEditing ? (
                                f.key.includes('Address') ? (
                                    <textarea className={styles.input} value={formData[f.key]} rows={2} onChange={e => handleChange(f.key, e.target.value)} />
                                ) : (
                                    <input className={styles.input} type={f.type ?? 'text'} value={formData[f.key]} onChange={e => handleChange(f.key, e.target.value)} />
                                )
                            ) : (
                                <p className={styles.valueText}>{formData[f.key]}</p>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <button className={styles.btnPrimary} onClick={handleUpdate}>{t('Update')}</button>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
