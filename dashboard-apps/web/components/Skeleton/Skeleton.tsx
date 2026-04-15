import styles from './Skeleton.module.scss';

// ─── Primitive bone ───────────────────────────────────────────────────────────

interface BoneProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Bone({ width = '100%', height = '14px', borderRadius = '6px', className, style }: BoneProps) {
    return (
        <span
            className={`${styles.bone}${className ? ` ${className}` : ''}`}
            style={{ width, height, borderRadius, display: 'block', ...style }}
            aria-hidden="true"
        />
    );
}

// ─── Generic card skeleton ────────────────────────────────────────────────────

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
    const widths = ['45%', '70%', '55%', '80%', '40%'];
    return (
        <div className={styles.card} aria-hidden="true">
            <Bone height="18px" width="45%" />
            {Array.from({ length: lines - 1 }, (_, i) => (
                <Bone key={i} height="13px" width={widths[(i + 1) % widths.length]} />
            ))}
        </div>
    );
}

// ─── Claim list skeleton ──────────────────────────────────────────────────────

export function SkeletonClaimList({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={styles.claimRow} aria-hidden="true">
                    <Bone height="12px" width="30%" borderRadius="4px" />
                    <Bone height="20px" width="55%" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Bone height="13px" width="80%" />
                            <Bone height="13px" width="65%" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                            <Bone height="13px" width="60px" />
                            <Bone height="20px" width="90px" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

// ─── Provider card skeleton ───────────────────────────────────────────────────

export function SkeletonProviderList({ count = 3 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={styles.providerCard} aria-hidden="true">
                    <div className={styles.providerAvatar} />
                    <div className={styles.providerLines}>
                        <Bone height="18px" width="55%" />
                        <Bone height="13px" width="40%" />
                        <Bone height="13px" width="70%" />
                        <Bone height="13px" width="50%" />
                    </div>
                </div>
            ))}
        </>
    );
}

// ─── Dashboard hero skeleton ──────────────────────────────────────────────────

export function SkeletonHero() {
    return (
        <div className={styles.hero} aria-hidden="true">
            <Bone height="16px" width="120px" borderRadius="4px" />
            <Bone height="36px" width="260px" borderRadius="8px" />
        </div>
    );
}
