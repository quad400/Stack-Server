import express, { Express } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";


const app: Express = express();

// Middlewares
dotenv.config();


app.use(helmet());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json({limit: "10kb"}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet())


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 100,
    message: "Too many request from this IP, please try again in an hour"
});
app.use("/twak", limiter);

export default app