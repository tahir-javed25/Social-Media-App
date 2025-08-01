import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.js";

dotenv.config();


export const protectRoute = async (req,res,next)=>{
    try {
    const token = req.cookies.token;
    // console.log(token);
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if(!decode){
        return res.status(500).json({
            message: "Porblem with the authentication"
        })
    }

    const user = await User.findById(decode.userId).select("-password");
    // console.log(user);
    

      if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }

    // req.user = user; here we can only store the Id of the user as we can also get the user just from his ID
    req.id = user._id
    

   return next();

        
    } catch (error) {
         console.log("Cookie is not given Please Login First", error.message)
        return res.status(500).json({
            message:error.message
        })
        
    }
   
}