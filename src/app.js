import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//ROUTERS
import userRouter from "./routes/user.routes.js";

const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: `${process.env.FRONTEND_ORIGIN}`,
    credentials: true,
  })
);

// JSON parser
app.use(express.json({ limit: "16kb" }));

// Parse the URL-encoded data
//because of this 'extended' we can use nested object inside object
app.use(express.urlencoded({ extended: true }));

// Serving static files
app.use(express.static("public"));

// Parse cookies
//we have to pass 'sameSite' and 'secure' to get the cookies in the browser through RTK query.
app.use(cookieParser({ sameSite: "Strict", secure: true }));

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hi there</h1> \n\t<h3>App is live!!!</h3>");
});

app.use("/api/v1/users", userRouter);

export default app;
