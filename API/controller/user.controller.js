import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/libs.js";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const getuser = (req,res)=>{
    console.log("get use is hitted")
     res.status(200).json({
                success:false,
                msg: "get user"
            })

}
export const signup =async (req,res)=>{
    console.log("server is working");
    

    try {
        console.log(req.body); 
        const {userName, email, password} = req.body;
        if(!userName || !email || !password){
           return res.status(400).json({
                success:false,
                msg: "Fill all the required fields"
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success:false,
                msg:"User already exists with this Email!"
            })
        }
        // const salt = await bcrypt.genSalt(10)    // and we can directly write 10 in place of salt there
        const hashedPass = await bcrypt.hash(password, 10);

        const newUser=  new User({
            userName,
            email,
            password:hashedPass,
        }) 

       await newUser.save();
        res.status(200).json({
        success: true,
        data: newUser
       })

    } catch (error) {
        console.log(error.message);
        
        res.status(400).json({
                success:false,
                msg:"Server Error found"
            })
        
    }

}
export const login=async (req,res)=>{

    try {

        console.log(req.body);
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).json({
                succeess:false,
                msg: "Please fill all the fileds"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({
                succeess:false,
                msg: "User does not Exist"
            })
        }

       const matchedPassword = await bcrypt.compare(password, user.password)
       if(!matchedPassword){
        res.status(400).json({
                succeess:false,
                msg: "Email/Password is Wrong"
            })
       }

       generateToken(user._id,req,res)

        res.status(200).json({
            user:user._id,
            success:true,
            msg:"Loged In Successful"   
        })
           
    } catch (error) {
        console.log(error.message);
        
        res.status(400).json({
            success:false,
            msg:"Sever Error is here"
        })      
    }
}

export const logout =async (req,res)=>{
    try {
        await res.cookie("token","",{maxAge:0,httponly:true, samesite:"strict",})
         res.status(200).json({
        message: "log out user"
    })

    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            msg: "Plase try again",
        }) 
    }      
}


export const getProfile =async (req,res)=>{
    const userId = req.params.id;
    try {

        const user = User.findById(userId).populate({path:"posts", created:-1}).populate({path:"bookmark"})

        res.status(200).json({
            success:true,
            msg:"here are the user Details",
            user
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            success:false,
            msg:"Can't reach the user"
        })
       
    }
}

export const getSuggestedUsers =async (req,res)=>{
    // const  userId= req.id;   we can directly give the user.id to the find operation.
    try {
        const suggestedUsers = User.find({ _id: { $ne:req.id  }  }).select("-password");

         if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        res.status(200).json({
            success:true,
            msg:" List of Other Users",
            users: suggestedUsers
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            success:false,
            msg:"Can't get user right now"
        })  
    }
}


export const updateProfile =async(req,res) =>{
    const userId = req.id
    const{bio, gender} = req.body;
    const profilePicture = req.files
    try{

        let cloudResponse;
        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
           cloudResponse =  await cloudinary.uploader.upload(fileUri)
        }

        const user = User.findById(userId).select("-password");

        if(!user){
            res.status(400).json({
                msg:"User Not found Sorry!!"
            })
        }

        if(bio) user.bio = bio;
        if(gender) user.gender = gender
        if(profilePicture) user.profilePicture = cloudResponse.secure_url

        await user.save();

        res.status(200).json({
            msg:"User Information Updated",
            success:true,
            user
        })   

    }
    catch(error){
         console.log(error.message);
        res.status(400).json({
            success:false,
            msg:"Can't update the Profile"
        })  
    }
}


export const followAndUnfollow =async(req,res) =>{
    const followingUser = req.id;
    const followedUser = re.params.id

    try {
        if(followedUser === followingUser){
            res.status(400).json({
                msg:"Follower and Following can't be the Same"
            })
        }

        const user = await User.findById(followingUser).select("-password")
        const targetuser = await User.findById(followedUser).select("-password")

        if(!user || !targetuser){
            res.status(400).json({
                success:false,
                msg:"There is no user here"
            })
        }

        const isFollowing = user.following.includes(followedUser);

        // Unfollowing Logic
        if(isFollowing){
            await User.updateOne( {_id: followingUser}, {$pull: { following: followedUser } } );
            await User.updateOne( {_id: followedUser}, {$pull: { follower: followingUser } } );
        }else{
            // following logic 
            await User.updateOne( { _id: followingUser}, { $push: { following : followedUser } } )
            await User.updateOne( { _id: followedUser}, { $push : { follower : followingUser } } )
        }


    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            succeess:false,
            msg:"Something went wrong"
        })
        
    }
}

