/// <reference path="../types/express-session.d.ts" />
import { Router, Request, Response } from "express";

const router = Router();

const USER = {
    username: "admin",
    password: "123456",
};

router.post("/login", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === USER.username && password === USER.password) {
        req.session.user = { username };
        req.session.save(err => {
            if (err) return res.status(500).json({ message: "Session save failed" });
            return res.json({ message: "Login successful" });
        });
        return;
    }

    return res.status(401).json({ message: "Invalid credentials" });
});

router.post("/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.json({ message: "Logout success" });
    });
});

router.get("/dashboard", (req: Request, res: Response) => {
    console.log("Cookie:", req.headers.cookie);
    console.log("Session:", req.session);
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(401).json({ message: "Not logged in" });
});

export default router;
