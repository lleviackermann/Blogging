import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { controllers } from "./controllers";
import { verifyJWT } from "./middleware/auth";

const app: Express = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['POST', 'GET', 'HEAD', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.post("/signup", controllers.auth.signup);
app.post("/login", controllers.auth.login);
app.get("/logout", controllers.auth.logout);
app.post("/post", verifyJWT, controllers.posts.createPost);
app.get("/posts", verifyJWT, controllers.posts.getPosts);
app.post("/posts/:postId/toggle-like", verifyJWT, controllers.posts.toggleLike);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@kanban-cluster-0.5q9wq.mongodb.net/?retryWrites=true&w=majority&appName=kanban-cluster-0`).then(() => {
    console.log("database connected");
    app.listen(8000, () => {
        console.log("App running on 8000 port");
    })
}).catch((err: any) => {
    console.log(err);
})