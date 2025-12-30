import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.route";
import helloRoute from "./routes/hello.route";
import authRoute from "./routes/auth.route";
import dashboardRoute from "./routes/dashboard.route";

const app = express();
// ================== CORS ==================
const allowedOrigins = [
    "http://localhost:8080",
    "http://48.194.96.109",
    "https://quanghuy-07.id.vn"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

// ================== BODY ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== ROUTES ==================
app.use("/api", healthRoute);
app.use("/api", helloRoute);
app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute);

export default app;