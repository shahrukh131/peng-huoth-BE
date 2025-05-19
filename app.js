require("module-alias/register");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  globalErrorHandler,
  notFoundMiddleware,
} = require("@middlewares/Error");
const { Sequelize } = require("sequelize");
const dbConfig = require("./config/config.js");
const logger = require("@utils/logger");
// import routes middleware
const routes = require("./routes");
const authMiddleware = require("./middlewares/authMiddleware.js");
const path = require("path");
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebaseServiceAccountKey.json');
const TelegramBot = require("node-telegram-bot-api");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let corsOptions = {
  origin: "https://localhost:8081",
};

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,

  {
    host: dbConfig.development.host,
    port: dbConfig.development.port,
    dialect: dbConfig.development.dialect,
    logging: false, // Optional: Disable logging of SQL queries
  }
);

/**
 ** Check the database connection
 */
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
  })
  .catch((error) => {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  });

/**
 ** Middleware
 */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Replace with your own Telegram Bot Token
const TELEGRAM_BOT_TOKEN = '8090911281:AAExxDME5QNOiXRWVZcHtO_QfL0n9F33oa4';
// Replace with your team's chat ID
const TELEGRAM_CHAT_ID = '-1002600392570';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

app.get('/get-updates', async (req, res) => {
  try {
    const updates = await bot.getUpdates();
    console.log(JSON.stringify(updates, null, 2));
    res.send(updates);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.post('/send-notification', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    await bot.sendMessage(TELEGRAM_CHAT_ID, message);

    res.status(200).json({ success: true, message: 'Notification sent successfully!' });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
});



//* Serve the 'downloads' directory as static
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  "/downloads",
  express.static(path.join(__dirname, "public", "downloads"))
);

//* use routes middleware
app.use("/api", routes);

const PORT = process.env.PORT || 8000;
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Peng Huoth Application" });
});

app.post('/send-push-notification', async (req, res) => {
  const { token, title, body } = req.body;


  const message = {
    notification: {
      title,
      body
    },
    token
  };
  

  try {
    const response = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', response);
    
    res.status(200).json({ success: true, message: 'Notification sent!', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use(globalErrorHandler);
app.use(notFoundMiddleware);

app.listen(PORT, () => {
  logger.info(`Server running at PORT ${PORT}`);
});
