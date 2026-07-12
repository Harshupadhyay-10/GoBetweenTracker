const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    await apiInstance.sendTransacEmail({
      sender: { name: "Go Between India Logistics", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    console.log("Email sent successfully to:", to);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
}

module.exports = sendEmail;