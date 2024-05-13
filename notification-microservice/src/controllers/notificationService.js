import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: "janinduravishka1999@gmail.com",
    pass: "fhkw dmvw powe keeu",
  },
});

export async function sendEmailNotification(to, subject, message) {
  const mailOptions = {
    from: "janinduravishka1999@gamil.com",
    to: "janinduravishka1999@gamil.com",
    subject: "Notification from the Notification Microservice",
    html: "<p>" + "Send the notification successfully" + "</p>",
  };

  try {
    await transporter.sendMail(mailOptions);
    return "Email notification sent successfully";
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw new Error("Failed to send email notification");
  }
}
