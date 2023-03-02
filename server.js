import express from "express";
import passport from "passport";
import setupJWTStrategy from "./auth/index.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js"

export default function createServer() {
    const app = express();

    app.use(express.json());

    // Passport by itself is an authentication library. It allows us to build different authentication strategies on top of passport.
    setupJWTStrategy(passport);

    //Here is where you will add the authentication strategies
    // app.use()

    app.use("/auth", authRouter);

    app.use("/recipes", recipesRouter(passport));

    return app;
}