import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "16kb"}))

app.use(express.urlencoded({extended:true,limit : "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

// routes import
import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"
import videoRouter from "./routes/video.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"


// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/health",healthCheckRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/playlist",playlistRouter)




export { app };