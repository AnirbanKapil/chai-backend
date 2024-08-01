import dotenv from "dotenv";

import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})  

// import mongoose from "mongoose";

// import {DB_NAME} from "./constants";

connectDB();



















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