import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";

const app = express();

app.use(
    cors({
        origin:["https://localhost5173", "https://localhost5174"],
        credentials : true,
    }),
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/registerUser", userRoutes);


export default app;

