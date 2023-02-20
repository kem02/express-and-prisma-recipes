import express from "express";
import recipesRouter from "./routes/recipes.js"

export default function createServer(){
    const app = express();

    app.use(express.json());

    app.use("/recipes", recipesRouter)

    return app;
}