import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
export async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existinguserByEmail = await User.findOne({ email: email });
        if (existinguserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const existinguserByUsername = await User.findOne({ username: username });
        if (existinguserByUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
    
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["", "", ""]; 

        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const user = new User({
            email,
            password:hashedPassword,
            username,
            image
        });
        if(user){
            generateTokenAndSetCookie  (user._id, res)  ;
            await user.save(); 
        res.status(201).json({ 
            success: true, user: {
            ...user._doc,
            password: ""
        }
    });
    }

   
  

        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.log("Error in signup controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function login(req, res) {
try {
const { email, password } = req.body;    

if(!email || !password){
    return res.status(400).json({ success: false, message: "All fields are required" });
}

const user = await User.findOne({ email: email });
if (!user) {
    return res.status(404).json({ success: false, message: "Invalid credentials" });
}
const isPassworrdCorrect= await bcryptjs.compare(password, user.password);

if(!isPassworrdCorrect){
    return res.status(404).json({ success: false, message: "Invalid credentials" });
}
generateTokenAndSetCookie(user._id, res);
res.status(200).json({
    success:true,
    user:{...user._doc, password:""}

})
} catch (error) {
    console.log("Error in login controller: " + error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
}}

export async function logout(req, res) {
try{
res.clearCookie("jwt-netflix");
res.status(200).json({ success: true, message: "User logged out successfully" });
}catch(error){
    console.log("Error in logout controller: " + error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
}
}
