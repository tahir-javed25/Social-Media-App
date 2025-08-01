import { Router } from "express";
import { protectRoute } from "../middleware/auth.Middleware.js";
import { addPost } from "../controller/post.Controller.js";


const router = Router();

router.post("/add-post", protectRoute,addPost)



export const postRouter = router;