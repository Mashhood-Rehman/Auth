import express from "express";
import { connectDB } from "./DB/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({ origin: "https://deploy-mern-1whq.vercel.app", credentials: true })
);

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  connectDB();
  console.log("server is running on port", port);
});
