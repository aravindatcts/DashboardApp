'use client';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './AccessPermission.module.scss';

export default function AccessPermissionPage() {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t('Access Permission')}</h1>
                <div className={styles.card}>
                    <p className={styles.text}>{t('Manage who has access to your account and health information.')}</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
