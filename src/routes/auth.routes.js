import express from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/test", (req,res)=>{
  res.json({msg:"auth route working"});
});


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

export default router;
