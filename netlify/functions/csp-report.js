/**
 * CSP Violation Reporter
 * Ontvangt POST-requests van browsers die een CSP-overtreding detecteren.
 * Logs zijn zichtbaar in: Netlify dashboard → Functions → csp-report → Log
 */
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: '' };
    }

    try {
        const report    = JSON.parse(event.body);
        const violation = report['csp-report'] || report;
        console.warn('[CSP Violation]', JSON.stringify(violation, null, 2));
    } catch (_) {
        console.warn('[CSP Violation] Onleesbaar rapport ontvangen:', event.body);
    }

    return { statusCode: 204, body: '' };
};
