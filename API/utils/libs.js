import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"

configDotenv();

export const generateToken =async(userId,req,res)=>{

    try {
        const token =  jwt.sign({userId}, process.env.SECRET_KEY, {expiresIn:"7d"})

        res.cookie("token", token,
        {
        maxAge: 7*24*60*60*1000,
        httponly:true,
        secure:false,
        sameSite: "strict",}
        )
        return token;

    } catch (error) {
        console.log(error.message);
        
        res.status(400).json({
                succeess:false,
                msg: "Something went Wrong"
            })
        
    }


}