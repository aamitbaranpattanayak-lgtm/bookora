import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import eventRoutes from "./routes/event.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

// =========================
// Middlewares
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================
// Routes
// =========================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Bookora Backend Running Successfully",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// =========================
// Global Error Handler
// (MUST BE LAST)
// =========================

app.use(errorHandler);

export default app;