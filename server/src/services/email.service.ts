import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailAlert = async (userEmail: string, matches: any[]) => {
  if (!matches || matches.length === 0) {
    return;
  }
  //   html cards
  const listingsHtml = matches
    .map(
      (match) => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: sans-serif;">
      <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">${match.address}</h3>
      <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">
        ${match.neighborhood || "San Francisco"} • ${match.bedrooms === 0 ? "Studio" : `${match.bedrooms} Bed`}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
        <span style="font-weight: 700; color: #0f172a; font-size: 16px;">
          $${match.price.toLocaleString()}<span style="font-weight: 400; color: #64748b; font-size: 12px;">/mo</span>
        </span>
        <a href="${match.url}" style="background-color: #115e59; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
          View Listing
        </a>
      </div>
    </div>`,
    )
    .join("");

  // send email
  try {
    const { data, error } = await resend.emails.send({
      from: "Wesh Alerts <onboarding@resend.dev>",
      to: userEmail,
      subject: `Wesh Found ${matches.length} new apartments matches!`,
      html: `<div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0f172a;">Great news!</h2>
          <p style="color: #334155; line-height: 1.5; margin-bottom: 24px;">
            We just scanned the latest HotPads data and found new listings that perfectly match your search criteria.
          </p>
          
          ${listingsHtml}
          
          <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center;">
            You are receiving this alert because you asked Wesh to watch for new apartments.
          </p>
        </div>`,
    });
    if (error) {
      console.error("Error sending email:", error);
      return false;
    }
    console.log(`Email alert sent to ${userEmail}. ID ${data.id}`);
    return true;

  } catch (error) {
    console.log("Error sending email alert:", error);
    throw error;
  }
};

export { sendEmailAlert };