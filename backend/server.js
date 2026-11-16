import express from "express";
import dns from "dns";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ProductRoutes from "./routes/ProductRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use("/products", ProductRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT;

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
