import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/contacts", contactRoutes);


// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
