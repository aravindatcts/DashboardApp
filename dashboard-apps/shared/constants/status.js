// Shared claim status constants and badge style helper

export const STATUS_COLORS = {
    Paid: { bg: '#e8f5e9', border: '#c8e6c9', text: '#2e7d32' },
    Processed: { bg: '#e3f2fd', border: '#bbdefb', text: '#1565c0' },
    Denied: { bg: '#ffebee', border: '#ffcdd2', text: '#c62828' },
    Submitted: { bg: '#fff8e1', border: '#ffecb3', text: '#f57f17' },
};

/**
 * Returns the badge colors for a given claim status.
 * @param {string} status - 'Paid' | 'Processed' | 'Denied' | 'Submitted'
 * @returns {{ bg: string, border: string, text: string }}
 */
export function getBadgeStyle(status) {
    return STATUS_COLORS[status] || STATUS_COLORS.Submitted;
}

/**
 * Returns a human-readable badge label for a claim status.
 * @param {string} status
 * @returns {string}
 */
export function getBadgeLabel(status) {
    return status === 'Paid' ? 'Claim processed' : `Claim ${status.toLowerCase()}`;
}
