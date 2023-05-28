import express from "express";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import { readdirSync } from "fs";
import mongoose from "mongoose";
const morgan = require('morgan');
require('dotenv').config(); 

const csrfProtection = csrf({ cookie: true });

// Create express app
const app = express();
const url = "mongodb+srv://admin:CPUedu1002@cluster0.5t1xamo.mongodb.net/?retryWrites=true&w=majority";
//process.env.DATABASE
// Database connection
mongoose
  .connect(url, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

// Apply middlewares (code that will run before any response is sent back to client)
app.use(cors());
app.use(express.json({limit: '6mb'}));
app.use(cookieParser());
app.use(morgan("dev"));

// Template for creating new middleware
// app.use((req, res, next) => {
//     console.log("this is my own middleware"); //call back function (next)
//     next();     // must include next for middlewares or have some immediate response
// });

// Route
readdirSync("./routes",).map((r) =>
    app.use('/api', require(`./routes/${r}`))
);

// CSRF
// app.use(cookieParser());
app.use(csrfProtection);
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));