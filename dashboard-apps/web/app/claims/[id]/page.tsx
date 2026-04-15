'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { apiGet } from '@shared/api/client';
import { getBadgeStyle, getBadgeLabel } from '@shared/constants/status';
import { buildClaimTimeline } from '@shared/utils/timeline';
import { parseDollar } from '@shared/utils/formatters';
import styles from './ClaimDetail.module.scss';

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [claim, setClaim] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet(`/api/claims/${id}`)
            .then(data => { setClaim(data); setLoading(false); })
            .catch(() => { setClaim(null); setLoading(false); });
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.errorState}><p>Loading claim...</p></div>
                <Footer />
            </div>
        );
    }

    if (!claim) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.errorState}>
                    <p>Claim not found.</p>
                    <button className={styles.backBtn} onClick={() => router.back()}>← Back to Claims</button>
                </div>
                <Footer />
            </div>
        );
    }

    const badge = getBadgeStyle(claim.status) as any;
    const timeline = buildClaimTimeline(claim) as any[];
    const amountNum = parseDollar(claim.amount) as number;
    const payorAmt = (amountNum * 0.8).toFixed(2);
    const patientAmt = (amountNum * 0.2).toFixed(2);
    const timelineBgColors = ['#f8bbd0', '#ffe082', claim.status === 'Denied' ? '#ef9a9a' : '#a5d6a7'];
    const timelineDarkColors = ['#c2185b', '#f57f17', claim.status === 'Denied' ? '#d32f2f' : '#388e3c'];

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <button className={styles.breadcrumb} onClick={() => router.back()}>‹ Back to Claims</button>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Claim Detail</h1>
                    <button className={styles.downloadBtn}><span>📄</span> EOB Download</button>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                        <div>
                            <span className={styles.badge} style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}>{getBadgeLabel(claim.status)}</span>
                            <p className={styles.claimIdTitle}>Claim number {claim.id.replace('CLM', '')}</p>
                        </div>
                        <div className={styles.amountBlock}>
                            <p className={styles.amountLabel}>Claim amount</p>
                            <p className={styles.amountValue}>{claim.amount.replace('$', '')} USD</p>
                        </div>
                    </div>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCol}>
                            <div className={styles.infoGroup}><p className={styles.infoLabel}>Member</p><p className={styles.infoValue}>{claim.member}</p></div>
                            <div className={styles.infoGroup}><p className={styles.infoLabel}>Date of Treatment</p><p className={styles.infoValue}>{claim.date}</p></div>
                        </div>
                        <div className={styles.infoCol}>
                            <div className={styles.infoGroup}><p className={styles.infoLabel}>Provider</p><p className={styles.infoValue}>{claim.provider}</p></div>
                            <div className={styles.infoGroup}><p className={styles.infoLabel}>Diagnosis</p><p className={styles.infoValue}>J01.90 - Acute sinusitis</p></div>
                        </div>
                    </div>
                    <div className={styles.breakdownSection}>
                        <p className={styles.breakdownTitle}>Financial Responsibility Breakdown</p>
                        <div className={styles.stackedBar}>
                            <div className={styles.payorBar} style={{ flex: 0.8 }} />
                            <div className={styles.patientBar} style={{ flex: 0.2 }} />
                            <div className={styles.barMarker}>
                                <span className={styles.barMarkerLabel}>{claim.amount}</span>
                                <div className={styles.barMarkerLine} />
                            </div>
                        </div>
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ backgroundColor: '#004a99' }} />
                                <span className={styles.legendText}>Payor Responsibility:</span>
                                <strong className={styles.legendValue}>${payorAmt}</strong>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ backgroundColor: '#00c3a5' }} />
                                <span className={styles.legendText}>Patient Responsibility:</span>
                                <strong className={styles.legendValue}>${patientAmt}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.timelineCard}>
                    <p className={styles.timelineTitle}>Processing Timeline</p>
                    <div className={styles.timeline}>
                        {timeline.map((item, index) => {
                            const bgColor = item.completed ? timelineBgColors[index] : '#e0e0e0';
                            const darkColor = item.completed ? timelineDarkColors[index] : '#9e9e9e';
                            const isTop = index % 2 === 0;
                            return (
                                <div key={index} className={styles.arrowStep} style={{ zIndex: 10 - index, marginLeft: index === 0 ? 0 : -15 }}>
                                    <div className={styles.arrowBody} style={{ backgroundColor: bgColor, paddingLeft: index === 0 ? 0 : 15 }}>
                                        <span className={styles.arrowStatus} style={{ color: darkColor }}>{item.status}</span>
                                        {isTop ? (
                                            <div className={styles.nodeTop}>
                                                <span className={styles.nodeDate}>{item.completed ? item.date : 'Pending'}</span>
                                                <div className={styles.nodeDot} style={{ backgroundColor: darkColor }} />
                                                <div className={styles.nodeLine} style={{ backgroundColor: darkColor }} />
                                            </div>
                                        ) : (
                                            <div className={styles.nodeBottom}>
                                                <div className={styles.nodeLine} style={{ backgroundColor: darkColor }} />
                                                <div className={styles.nodeDot} style={{ backgroundColor: darkColor }} />
                                                <span className={styles.nodeDate}>{item.completed ? item.date : 'Pending'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.arrowHead} style={{ borderLeftColor: bgColor }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
