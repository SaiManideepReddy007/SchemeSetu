const axios = require('axios');

/**
 * Send transactional email for new scheme notification.
 * Integrates with Resend via standard HTTPS REST API.
 * Configured via server-side environment variables:
 * - RESEND_API_KEY
 * - EMAIL_FROM (default: notifications@schemesetu.gov.in or onboarding@resend.dev)
 * - CLIENT_URL (default: http://localhost:5173)
 */
async function sendNewSchemeEmail({ to, userName, scheme }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'SchemeSetu <onboarding@resend.dev>';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const schemeName = typeof scheme.name === 'string' ? scheme.name : (scheme.name?.en || 'New Scheme');
  const ministry = typeof scheme.ministry === 'string' ? scheme.ministry : (scheme.ministry?.en || 'Government of India');
  const description = typeof scheme.description === 'string' ? scheme.description : (scheme.description?.en || '');
  const schemeDetailUrl = `${clientUrl}/scheme/${scheme._id}`;

  if (!apiKey) {
    return {
      delivered: false,
      error: 'RESEND_API_KEY is not set. Configure it in server environment variables to deliver emails.'
    };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f8fc; margin: 0; padding: 24px; color: #153b69; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #d6e1ef; padding: 32px; box-shadow: 0 4px 18px rgba(18,64,112,0.06); }
        .header { border-bottom: 2px solid #f28a28; padding-bottom: 16px; margin-bottom: 24px; }
        .mark { font-size: 24px; font-weight: 800; color: #0755a2; text-decoration: none; }
        .mark span { color: #f28a28; }
        .tagline { font-size: 12px; color: #5e7089; margin-top: 4px; }
        h1 { font-size: 20px; color: #063d7d; margin: 0 0 12px; }
        .ministry { font-size: 13px; font-weight: 700; color: #5e7089; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .description { font-size: 15px; line-height: 1.6; color: #2a2a2a; margin-bottom: 24px; }
        .cta { display: inline-block; background: #0755a2; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #d6e1ef; font-size: 12px; color: #5e7089; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="mark">Scheme<span>Setu</span></div>
          <div class="tagline">Government Schemes | Your Right, Our Priority</div>
        </div>
        <p>Hello ${userName || 'Citizen'},</p>
        <p>A new government scheme has just been added to the SchemeSetu portal:</p>
        <h1>${schemeName}</h1>
        <div class="ministry">${ministry}</div>
        <p class="description">${description}</p>
        <div>
          <a href="${schemeDetailUrl}" class="cta" target="_blank" rel="noopener noreferrer">
            Review Eligibility &amp; Details &rarr;
          </a>
        </div>
        <div class="footer">
          <p>Please note: Eligibility conditions and application requirements should always be reviewed before applying on the official portal.</p>
          <p>You received this email because you opted into new-scheme notifications in your SchemeSetu Settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from,
        to: [to],
        subject: `New Government Scheme: ${schemeName}`,
        html
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return {
      delivered: true,
      messageId: response.data?.id
    };
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message;
    console.error(`Email delivery to ${to} failed:`, errorMessage);
    return {
      delivered: false,
      error: errorMessage
    };
  }
}

module.exports = {
  sendNewSchemeEmail
};
