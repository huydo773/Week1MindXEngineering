import express from "express";
import session from "express-session";
import cors from "cors";
import healthRoute from "./routes/health.route";
import helloRoute from "./routes/hello.route";
import authRouter from "./routes/auth.route";

const app = express();
app.set('trust proxy', 1);

app.use(cors({
    origin: [
        "https://frontendweb.azurewebsites.net/"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use("/", healthRoute);
app.use("/api", helloRoute);
app.use("/api", authRouter);

export default app;
