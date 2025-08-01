import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = async ()=>{
    try {
         const db = await mongoose.connect(process.env.DB);
    console.log(db.connection.host, "Database is connected");
    } catch (error) {
        console.log("Can't reach the Database")
        
    }
    
}
