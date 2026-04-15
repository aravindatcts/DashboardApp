'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { apiGet } from '@shared/api/client';
import type { Benefit, MemberOption } from '@/types';
import styles from './MyPlans.module.scss';

function BenefitRow({ benefit }: { benefit: Benefit }) {
    const { service, payorPays, youPay, isFixed, fixedText } = benefit;
    return (
        <div className={styles.benefitRow}>
            <span className={styles.serviceName}>{service}</span>
            {isFixed ? (
                <span className={styles.fixedBadge}>{fixedText}</span>
            ) : (
                <div className={styles.splitBar}>
                    <div className={styles.payorPart} style={{ flexBasis: `${payorPays}%` }}>
                        <span className={styles.splitLabel}>{payorPays}%</span>
                    </div>
                    <div className={styles.youPart} style={{ flexBasis: `${youPay}%` }}>
                        <span className={styles.splitLabel}>{youPay}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}

interface BenefitsApiResponse {
    benefits: Benefit[];
    networkOptions: string[];
}

interface MembersApiResponse {
    memberOptions: MemberOption[];
}

export default function MyPlansPage() {
    const { t } = useTranslation();
    const [selectedMember, setSelectedMember] = useState('Sarah Jenkins');
    const [selectedNetwork, setSelectedNetwork] = useState('IN-NETWORK United States');
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [networkOptions, setNetworkOptions] = useState<string[]>([]);
    const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);

    useEffect(() => {
        Promise.all([apiGet('/api/benefits'), apiGet('/api/members')])
            .then(([benefitsData, membersData]: [BenefitsApiResponse, MembersApiResponse]) => {
                setBenefits(benefitsData.benefits);
                setNetworkOptions(benefitsData.networkOptions);
                if (benefitsData.networkOptions.length) setSelectedNetwork(benefitsData.networkOptions[0]);
                setMemberOptions(membersData.memberOptions);
            })
            .catch(err => console.error('Failed to load plan data:', err));
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.pageTitle}>{t('My Current Plan Benefits')}</h1>
                <div className={styles.card}>
                    <div className={styles.filtersRow}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>{t('View Current Benefits by Family Member')}</label>
                            <select className={styles.select} value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                                {memberOptions.map((o: MemberOption) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>{t('View by plan options:')}</label>
                            <select className={styles.select} value={selectedNetwork} onChange={e => setSelectedNetwork(e.target.value)}>
                                {networkOptions.map(n => <option key={n} value={n}>{t(n)}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={styles.disclaimer}>
                        {t('The information on this page provides highlights of coverage only. It is not a contract. Coverage is subject to your plan terms, including exclusions and limitations. If there are any differences between the information on this page and your official plan documents, the terms of the plan document will control.')}
                    </div>
                    <div className={styles.benefitsTable}>
                        <div className={styles.tableHeader}>
                            <span>{t('Service Covered')}</span>
                            <div className={styles.legendRow}>
                                <span className={styles.payorLegend}>{t('Payor')}</span>
                                <span className={styles.youLegend}>{t('You')}</span>
                            </div>
                        </div>
                        {benefits.map((benefit: Benefit) => <BenefitRow key={benefit.service} benefit={benefit} />)}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
