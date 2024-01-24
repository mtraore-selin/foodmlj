import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import path from "path";

import { fileURLToPath } from "url";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/OrderRouter.js";

dotenv.config();

const app = express();
const { PORT, MONGO_URI } = process.env;
// to parse body in json format (body parser)
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
const uri = "mongodb://127.0.0.1/food";
mongoose.set("strictQuery", false);

mongoose.connect(MONGO_URI ?? uri, (err) => {
  if (err) throw err;
  console.log("connected...");
});

app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Serve up static assets
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT ?? 5000, () => {
  console.log(`server running at http://localhost:${PORT ?? 5000}`);
});
