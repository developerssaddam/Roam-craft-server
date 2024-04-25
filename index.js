import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";

// Init express
const app = express();
dotenv.config();

// Environment variables
const port = process.env.PORT || 9000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "",
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send(`Tourism Management server is running on port : ${port}`);
});

// listen server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`.bgMagenta.black);
});
