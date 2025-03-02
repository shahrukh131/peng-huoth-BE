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
const  generateOTP  = require("./utils/generateOTP.js");


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
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully.'); 
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error); 
    process.exit(1); 
  });


/**
 ** Middleware
 */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// use routes middleware
app.use("/api", routes);

const PORT = process.env.PORT || 8000;
app.get('/api/protected',authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Peng Huoth Application" });
});




app.use(globalErrorHandler);
app.use(notFoundMiddleware);


app.listen(PORT, () => {
  logger.info(`Server running at PORT ${PORT}`)
});
