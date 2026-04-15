'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { SkeletonHero, SkeletonCard } from '@/components/Skeleton/Skeleton';
import { useAccumulators } from '@shared/hooks/useAccumulators';
import { usePcpData } from '@shared/hooks/usePcpData';
import { useIdCard } from '@shared/hooks/useIdCard';
import { useDashboardData } from '@shared/hooks/useDashboardData';
import type { Claim, PlanInfo, CoveredMember, MemberOption, AccumulatorItem, PcpInfo } from '@/types';
import styles from './Dashboard.module.scss';

// ─── Shared Card shell ────────────────────────────────────────────────────────

function Card({ title, children, animClass }: { title: string; children: React.ReactNode; animClass?: string }) {
    return (
        <div className={`${styles.card} ${animClass ?? ''}`}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{title}</h2>
            </div>
            <div className={styles.cardContent}>{children}</div>
        </div>
    );
}

// ─── Care Concierge ───────────────────────────────────────────────────────────

function AgenticConcierge() {
    const [messages] = useState([{
        id: 1,
        text: "Hi Sarah. I reviewed your recent City Radiology claim — it's mostly covered. Do you need help finding an in-network physical therapist nearby?",
        isUser: false,
    }]);
    const [inputText, setInputText] = useState('');
    return (
        <Card title="Care Concierge" animClass="animate-fade-up stagger-1">
            <div className={styles.chatMessages}>
                {messages.map(msg => (
                    <div key={msg.id} className={`${styles.chatBubble} ${msg.isUser ? styles.chatBubbleUser : styles.chatBubbleBot}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className={styles.chatInputRow}>
                <input
                    className={styles.chatInput}
                    placeholder="Ask about claims, coverage, or care..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                />
                <button className={styles.btnPrimary}>Send</button>
            </div>
        </Card>
    );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

function RecentClaims({ claims }: { claims: Claim[] }) {
    const router = useRouter();
    return (
        <Card title="Recent Activity" animClass="animate-fade-up stagger-2">
            <div className={styles.claimsList}>
                {claims.map((claim: Claim, i: number) => (
                    <button
                        key={claim.id}
                        className={`${styles.recentClaimRow} animate-fade-up stagger-${i + 3}`}
                        onClick={() => router.push(`/claims/${claim.id}`)}
                    >
                        <div>
                            <p className={styles.recentClaimProvider}>{claim.provider}</p>
                            <p className={styles.recentClaimDate}>{claim.date}</p>
                        </div>
                        <div className={styles.recentClaimRight}>
                            <p className={styles.recentClaimAmount}>{claim.amount}</p>
                            <span
                                className={styles.recentClaimBadge}
                                style={{ color: claim.color as string, backgroundColor: `${claim.color as string}20` }}
                            >
                                {claim.status.toUpperCase()}
                            </span>
                        </div>
                    </button>
                ))}
                <button className={styles.viewAllBtn} onClick={() => router.push('/claims')}>
                    View All Activity →
                </button>
            </div>
        </Card>
    );
}

// ─── Accumulators ─────────────────────────────────────────────────────────────

interface AccumulatorsHook {
    selectedMember: string;
    setSelectedMember: (v: string) => void;
    tabs: string[];
    activeTab: string;
    setTab: (v: string) => void;
    data: AccumulatorItem[];
    memberOptions: MemberOption[];
}

function AccumulatorsInfoCard({ isDetailed = false }: { isDetailed?: boolean }) {
    const { t } = useTranslation();
    const { selectedMember, setSelectedMember, tabs, activeTab, setTab, data, memberOptions } = useAccumulators(isDetailed) as AccumulatorsHook;
    return (
        <Card title={t('Accumulators')} animClass="animate-fade-up stagger-3">
            {isDetailed && (
                <div className={styles.pickerWrapper}>
                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className={styles.picker}>
                        {memberOptions.map((o: MemberOption) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            )}
            <div className={styles.segmentedControl}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`${styles.segmentBtn} ${activeTab === tab ? styles.segmentBtnActive : ''}`}
                        onClick={() => setTab(tab)}
                    >
                        {t(tab)}
                    </button>
                ))}
            </div>
            <div className={styles.barsContainer}>
                {data.map((item: AccumulatorItem, idx: number) => {
                    const percentage = Math.round((item.spent / item.total) * 100);
                    const remaining = item.total - item.spent;
                    return (
                        <div key={idx} className={`${styles.barGroup} animate-fade-up stagger-${idx + 1}`}>
                            <div className={styles.barGroupHeader}>
                                <span className={styles.barLabel}>{item.label}</span>
                                <span className={styles.barTotal}>${item.total.toLocaleString()} Total</span>
                            </div>
                            <div className={styles.barSubHeader}>
                                <span>Spent: ${item.spent.toLocaleString()}</span>
                                <span>Remaining: ${remaining.toLocaleString()}</span>
                            </div>
                            <div className={styles.barTrack}>
                                <div className={styles.barFill} style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                                {percentage > 0 && (
                                    <>
                                        <div className={styles.barTick} style={{ left: `${percentage}%` }} />
                                        <span className={styles.barTickLabel} style={{ left: `${percentage}%` }}>${item.spent.toLocaleString()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

// ─── PCP Card ─────────────────────────────────────────────────────────────────

interface PcpDataHook {
    selectedMember: string;
    setSelectedMember: (v: string) => void;
    currentPcp: PcpInfo;
    memberOptions: MemberOption[];
}

function PcpInfoCard() {
    const { t } = useTranslation();
    const router = useRouter();
    const { selectedMember, setSelectedMember, currentPcp, memberOptions } = usePcpData() as PcpDataHook;
    return (
        <Card title={t('Primary Care Provider')} animClass="animate-fade-up stagger-1">
            <div className={styles.pickerWrapper}>
                <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className={styles.picker}>
                    {memberOptions.map((o: MemberOption) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>
            <div className={styles.pcpHeader}>
                <div className={styles.pcpAvatar} aria-hidden="true">👨‍⚕️</div>
                <div>
                    <p className={styles.pcpName}>{currentPcp.doc}</p>
                    <p className={styles.pcpSpec}>{currentPcp.spec}</p>
                </div>
            </div>
            <div className={styles.infoRow}><span className={styles.infoLabel}>Phone:</span><span className={styles.infoValue}>{currentPcp.phone}</span></div>
            <div className={styles.infoRow}><span className={styles.infoLabel}>Address:</span><span className={styles.infoValue}>{currentPcp.addr}</span></div>
            <div className={styles.actionRow}>
                <button className={styles.btnOutline} onClick={() => router.push('/search-pcp')}>{t('Update PCP')}</button>
                <button className={styles.btnPrimary}>{t('Schedule')}</button>
            </div>
        </Card>
    );
}

// ─── ID Card ──────────────────────────────────────────────────────────────────

interface IdCardHook {
    selectedMember: string;
    setSelectedMember: (v: string) => void;
    showBack: boolean;
    toggleSide: () => void;
    memberId: string;
    memberOptions: MemberOption[];
}

function IdCardDisplayCard() {
    const { t } = useTranslation();
    const { selectedMember, setSelectedMember, showBack, toggleSide, memberId, memberOptions } = useIdCard() as IdCardHook;
    return (
        <Card title={t('ID Cards')} animClass="animate-fade-up stagger-1">
            <div className={styles.pickerWrapper}>
                <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className={styles.picker}>
                    {memberOptions.map((o: MemberOption) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>
            <div className={styles.idCardWrapper}>
                <div className={`${styles.idCard} ${showBack ? styles.idCardFlipped : ''}`}>
                    {!showBack ? (
                        <div className={styles.idCardFront}>
                            <div className={styles.idCardBrandRow}>
                                <div className={styles.idCardLogo} aria-hidden="true">A</div>
                                <span className={styles.idCardBrandName}>America Health Insurance</span>
                            </div>
                            <div className={styles.idCardBody}>
                                <div className={styles.idCardLeft}>
                                    <p className={styles.idCardMemberName}>{selectedMember}</p>
                                    <p className={styles.idCardMemberId}>{memberId}</p>
                                    <div className={styles.idCardDetails}>
                                        <div><span>Group No.</span><strong>12345</strong></div>
                                        <div><span>RXBIN</span><strong>001234</strong></div>
                                        <div><span>RXPCN</span><strong>ABC</strong></div>
                                        <div><span>RXGRP</span><strong>RX1234</strong></div>
                                        <div><span>Plan Code</span><strong>123-456</strong></div>
                                    </div>
                                </div>
                                <div className={styles.idCardRight}>
                                    <div className={styles.idCardNetworkHeader}><span>In Network</span><span>Out Network</span></div>
                                    <div className={styles.idCardNetworkHeader}><span>Indv$/Fam$</span><span>Indv$/Fam$</span></div>
                                    <div className={styles.idCardDeductRow}><span>DED</span><strong>XX/XX</strong><strong>XX/XX</strong></div>
                                    <div className={styles.idCardDeductRow}><span>OPM</span><strong>XX/XX</strong><strong>XX/XX</strong></div>
                                    <p className={styles.idCardDisclaimer}>Full plan details available at americahealthinsurance.com.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.idCardBack}>
                            <div className={styles.idCardMagneticStripe} />
                            <p className={styles.idCardBackTitle}>{t('For Providers')}</p>
                            <p className={styles.idCardBackSub}>{t('File claims to your local America Health Insurance plan.')}</p>
                            <div className={styles.idCardBackRow}><span>{t('Medical Claims:')}</span><strong>1-800-555-1234</strong></div>
                            <div className={styles.idCardBackRow}><span>{t('Pharmacy Help Desk:')}</span><strong>1-800-555-9876</strong></div>
                            <p className={styles.idCardDisclaimer}>{t('This card is for identification purposes only and does not guarantee coverage.')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.actionRow}>
                <button className={styles.btnOutline} onClick={toggleSide}>{showBack ? t('Show Front') : t('Show Back')}</button>
                <button className={styles.btnPrimary}>{t('Add to Apple Wallet')}</button>
            </div>
        </Card>
    );
}

// ─── Plan Info ────────────────────────────────────────────────────────────────

function PlanInfoCard({ planInfo }: { planInfo: PlanInfo }) {
    return (
        <Card title="Plan Information" animClass="animate-fade-up stagger-1">
            {Object.entries({
                Plan: planInfo.plan,
                'Member ID': planInfo.memberId,
                'Group ID': planInfo.groupId,
                Effective: planInfo.effective,
                Status: planInfo.status,
            }).map(([label, value]) => (
                <div key={label} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{label}:</span>
                    <span className={`${styles.infoValue} ${label === 'Status' ? styles.statusActive : ''}`}>{value as string}</span>
                </div>
            ))}
        </Card>
    );
}

function CoveredMembersCard({ coveredMembers }: { coveredMembers: CoveredMember[] }) {
    const { t } = useTranslation();
    return (
        <Card title={t('Covered Members')} animClass="animate-fade-up stagger-2">
            {coveredMembers.map((m: CoveredMember) => (
                <div key={m.name} className={styles.infoRow}>
                    <span className={styles.infoValue}>{m.name}</span>
                    <span className={styles.infoLabel}>{m.rel}</span>
                </div>
            ))}
        </Card>
    );
}

function HraInfoCard({ hraBalance }: { hraBalance: string }) {
    const { t } = useTranslation();
    return (
        <Card title={t('Health Reimbursement Account')} animClass="animate-fade-up stagger-1">
            <div className={styles.hraBox}>
                <div>
                    <p className={styles.hraLabel}>{t('Available Balance')}</p>
                    <p className={styles.hraBalance}>{hraBalance}</p>
                </div>
                <button className={styles.btnOutline}>{t('View Transactions')}</button>
            </div>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface DashboardHook {
    planInfo: PlanInfo;
    coveredMembers: CoveredMember[];
    hraBalance: string;
    recentClaims: Claim[];
    dashboardTabs: string[];
    memberOptions: MemberOption[];
    loading: boolean;
}

export default function DashboardPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('Overview');
    const { planInfo, coveredMembers, hraBalance, recentClaims, dashboardTabs, loading } = useDashboardData() as DashboardHook;

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                {/* Hero */}
                {loading ? (
                    <SkeletonHero />
                ) : (
                    <div className={`${styles.hero} animate-fade-in`}>
                        <p className={styles.heroGreeting}>Welcome back,</p>
                        <h1 className={`${styles.heroName} animate-fade-up stagger-1`}>Sarah Jenkins</h1>
                    </div>
                )}

                {/* Tab bar */}
                <nav className={`${styles.tabBar} animate-fade-in`} aria-label="Dashboard tabs">
                    {(loading ? ['Overview', 'ID Cards', 'Care', 'Coverage', 'Finances'] : dashboardTabs).map((tab, i) => (
                        <button
                            key={tab}
                            className={`${styles.tabItem} ${activeTab === tab ? styles.tabItemActive : ''} stagger-${i + 1}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {t(tab)}
                        </button>
                    ))}
                </nav>

                {/* Tab content */}
                <div className={styles.tabContent} key={activeTab}>
                    {loading ? (
                        <div className={styles.tabPanel}>
                            <SkeletonCard lines={4} />
                            <SkeletonCard lines={3} />
                            <SkeletonCard lines={5} />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'Overview' && (
                                <div className={styles.tabPanel}>
                                    <AgenticConcierge />
                                    <RecentClaims claims={recentClaims} />
                                    <AccumulatorsInfoCard isDetailed={false} />
                                </div>
                            )}
                            {activeTab === 'ID Cards' && <div className={styles.tabPanel}><IdCardDisplayCard /></div>}
                            {activeTab === 'Care' && <div className={styles.tabPanel}><PcpInfoCard /></div>}
                            {activeTab === 'Coverage' && (
                                <div className={styles.tabPanel}>
                                    <PlanInfoCard planInfo={planInfo} />
                                    <CoveredMembersCard coveredMembers={coveredMembers} />
                                </div>
                            )}
                            {activeTab === 'Finances' && (
                                <div className={styles.tabPanel}>
                                    <AccumulatorsInfoCard isDetailed={true} />
                                    <HraInfoCard hraBalance={hraBalance} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
