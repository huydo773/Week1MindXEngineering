import { Router } from "express";
import { hello } from "../controllers/hello.controller";

const router = Router();

router.get("/hello", hello);

export default router;