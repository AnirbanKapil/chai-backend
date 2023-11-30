import dotenv from "dotenv";

dotenv.config({
    path : "./env"
})

// import mongoose from "mongoose";

// import {DB_NAME} from "./constants";

import connectDB from "./db/index.js";



















// import express from "express";

// const app = express();

// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB.URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERROR :", error);
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`app listening on Port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("ERROR :", error)
//         throw error
//     }
// })()