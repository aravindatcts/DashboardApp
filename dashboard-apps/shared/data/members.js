// Shared member, PCP, ID card, and covered-member data

/** Covered members for the Jenkins family */
export const COVERED_MEMBERS = [
    { name: 'Sarah Jenkins', rel: 'Subscriber' },
    { name: 'Mark Jenkins', rel: 'Spouse' },
    { name: 'Emily Jenkins', rel: 'Child' },
];

/** PCP data keyed by member name */
export const PCP_DATA = {
    'Sarah Jenkins': {
        doc: 'Dr. Anya Sharma, MD',
        spec: 'Obstetrics & Gynecology',
        phone: '(555) 765-4321',
        addr: "456 Women's Health Plaza",
    },
    'Mark Jenkins': {
        doc: 'Dr. Robert Chen, MD',
        spec: 'Internal Medicine',
        phone: '(555) 123-4567',
        addr: '789 Medical Center Dr',
    },
    'Emily Jenkins': {
        doc: 'Dr. Emily Foster, MD',
        spec: 'Pediatrics',
        phone: '(555) 987-6543',
        addr: '123 Childrens Way',
    },
};

/** ID card member numbers keyed by member name */
export const ID_CARD_DATA = {
    'Sarah Jenkins': 'XQHW12345678',
    'Mark Jenkins': 'XQHW12345678-01',
    'Emily Jenkins': 'XQHW12345678-02',
};

/** Member picker options (used in PCP, ID card, accumulators) */
export const MEMBER_OPTIONS = [
    { label: 'Sarah Jenkins (Subscriber)', value: 'Sarah Jenkins' },
    { label: 'Mark Jenkins (Spouse)', value: 'Mark Jenkins' },
    { label: 'Emily Jenkins (Child)', value: 'Emily Jenkins' },
];

/** Plan information */
export const PLAN_INFO = {
    plan: 'FictiousHealth Choice POS II',
    memberId: 'W123456789',
    groupId: '102938',
    effective: '01/01/2023',
    status: 'Active',
};

/** Recent claims shown on dashboard overview tab */
export const RECENT_CLAIMS_DASHBOARD = [
    { id: 'CLM001', date: 'Oct 24, 2023', provider: 'General Hospital', status: 'Processed', amount: '$120.00', color: '#34c759' },
    { id: 'CLM002', date: 'Oct 15, 2023', provider: 'City Radiology', status: 'Pending', amount: '$450.00', color: '#ff9500' },
];

/** HRA balance */
export const HRA_BALANCE = '$1,200.00';

/** Accumulator data factory — returns in-network and out-of-network data for a given member name */
export function getAccumulatorData(memberName) {
    const firstName = memberName.split(' ')[0];
    const indDeductSpent = memberName === 'Sarah Jenkins' ? 1250 : memberName === 'Mark Jenkins' ? 850 : 0;
    const indOopSpent = memberName === 'Sarah Jenkins' ? 4500 : memberName === 'Mark Jenkins' ? 700 : 0;

    return {
        inNetwork: [
            { label: `${firstName}'s Deductible`, spent: indDeductSpent, total: 3000, color: '#0066cc' },
            { label: 'Family Deductible', spent: 2100, total: 6000, color: '#34c759' },
            { label: `${firstName}'s Out-of-Pocket`, spent: indOopSpent, total: 8000, color: '#5e5ce6' },
            { label: 'Family Out-of-Pocket', spent: 5200, total: 16000, color: '#ff9500' },
        ],
        outNetwork: [
            { label: `${firstName}'s Deductible`, spent: 0, total: 6000, color: '#0066cc' },
            { label: 'Family Deductible', spent: 0, total: 12000, color: '#34c759' },
            { label: `${firstName}'s Out-of-Pocket`, spent: 0, total: 16000, color: '#5e5ce6' },
            { label: 'Family Out-of-Pocket', spent: 200, total: 32000, color: '#ff9500' },
        ],
    };
}

/** Dashboard tab list */
export const DASHBOARD_TABS = ['Overview', 'ID Cards', 'Care', 'Coverage', 'Finances'];
