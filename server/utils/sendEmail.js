const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

async function sendEmail({ to, subject, html }) {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: { name: "Go Between India Logistics", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
    });
    console.log("Email sent successfully to:", to);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
}

module.exports = sendEmail;