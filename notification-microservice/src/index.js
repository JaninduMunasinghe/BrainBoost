import express from "express";
import { sendEmailNotification } from "./controllers/notificationService.js";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.NOTIFICATION_PORT;

app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const result = await sendEmailNotification(to, subject, message);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error("Error sending email notification:", error);
    res.status(500).json({ error: "Failed to send email notification" });
  }
});

app.listen(PORT, () => {
  console.log(`Notification Server is running on port ${PORT}`);
});
