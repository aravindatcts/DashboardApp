// Shared utility: formatters

/**
 * Strips the dollar sign and parses to float.
 * @param {string} amountStr - e.g. '$150.00'
 * @returns {number}
 */
export function parseDollar(amountStr) {
    return parseFloat(amountStr.replace('$', ''));
}

/**
 * Formats a number as a USD string with 2 decimal places.
 * @param {number} value
 * @returns {string} e.g. '$150.00'
 */
export function formatUSD(value) {
    return `$${Number(value).toFixed(2)}`;
}

/**
 * Formats a large integer with commas.
 * @param {number} value
 * @returns {string} e.g. '1,250'
 */
export function formatNumber(value) {
    return value.toLocaleString();
}

/**
 * Strips CLM prefix to get the readable claim number.
 * @param {string} id - e.g. 'CLM001'
 * @returns {string} e.g. '001'
 */
export function formatClaimNumber(id) {
    return id.replace('CLM', '');
}
