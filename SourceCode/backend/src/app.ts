import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import healthRoute from "./routes/health.route";
import helloRoute from "./routes/hello.route";
import authRoute from "./routes/auth.route";

const app = express();

const JWT_SECRET = process.env.JWT_SECRET!;

// Danh sách frontend được phép gọi
const allowedOrigins = [
    "http://localhost:8080",
    "http://48.194.96.109",
    "https://frontendweb.azurewebsites.net"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const USER = { username: "admin", password: "123456" };

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
        return res.json({ token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers["authorization"];
    console.log("Header Authorization nhận được:", authHeader);
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    console.log("Token nhận được:", token);
    console.log("Secret dùng để check:", JWT_SECRET);
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

// Dashboard route
app.get("/api/dashboard", authenticateToken, (req: any, res: any) => {
    console.log("req.user =", req.user);
    res.json({ user: req.user });
});

app.use("/api", healthRoute);
app.use("/api", helloRoute);
app.use("/api", authRoute);

export default app;