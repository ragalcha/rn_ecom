import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/seller", sellerRouter);

export { app };
