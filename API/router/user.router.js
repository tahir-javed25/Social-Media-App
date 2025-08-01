import { Router } from "express";
import { followAndUnfollow, getProfile, getSuggestedUsers, getuser, login, logout, signup, updateProfile } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.Middleware.js";

const router = Router();


// router.post("/getuser", getuser)
router.post("/signup", signup)
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:id",protectRoute, getProfile);
router.put("/profile/edit/:id",protectRoute,updateProfile)
router.get("/suggestedUsers",protectRoute, getSuggestedUsers)
router.put("followorunfollow/:id", protectRoute, followAndUnfollow);




export const userRouter = router;