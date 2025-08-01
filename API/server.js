import express from "express";
import { userRouter } from "./router/user.router.js";
import cookieParser from "cookie-parser";
import { connectDb } from "./utils/DB.js";
import { configDotenv } from "dotenv";
import { postRouter } from "./router/post.router.js";

configDotenv();

const PORT =  3000;


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials:true,
//      methods: ["GET", "POST", "DELETE", "PUT"],
//     allowedHeaders: ["Content-Type","Authorization","Cache-Control","Expires","Pragma",],
// }))


// app.use(fileUpload({
//   useTempFiles: true, 
//   tempFileDir: "/tmp/" 
// }));

app.use("/user",userRouter)
app.use("/post", postRouter)


app.listen(PORT, (req,res)=>{
    console.log(`server is running at http://localhost:${PORT} `);
    connectDb();
    
})