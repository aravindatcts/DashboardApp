// Shared utility: claim processing timeline builder

/**
 * Builds the 3-step processing timeline for a claim.
 * @param {object} claim - A claim object with at least { status, date }
 * @returns {Array<{ status: string, date: string, completed: boolean, isFinal: boolean }>}
 */
export function buildClaimTimeline(claim) {
    const claimDate = new Date(claim.date);

    const submittedDate = new Date(claimDate);
    submittedDate.setDate(claimDate.getDate() - 10);

    const processedDate = new Date(claimDate);
    processedDate.setDate(claimDate.getDate() - 3);

    const finalStatus = claim.status === 'Denied' ? 'Denied' : 'Paid';

    return [
        {
            status: 'Submitted',
            date: submittedDate.toISOString().split('T')[0],
            completed: true,
            isFinal: false,
        },
        {
            status: 'Processed',
            date: processedDate.toISOString().split('T')[0],
            completed: ['Processed', 'Paid', 'Denied'].includes(claim.status),
            isFinal: false,
        },
        {
            status: finalStatus,
            date: claim.date,
            completed: ['Paid', 'Denied'].includes(claim.status),
            isFinal: true,
        },
    ];
}
