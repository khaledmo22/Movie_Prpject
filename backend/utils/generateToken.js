import Jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/enVars.js";


export const generateTokenAndSetCookie = (userId, res) => {
    const token = Jwt.sign({ userId }, ENV_VARS.JWT_SECRET,{expiresIn:"50d"});

    res.cookie("jwt-netflix", token, { 
        maxAge: 15 *24 *60*60* 1000, // 15 days in MS 
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks, make it not be accessed by JS 
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks 
        secure: ENV_VARS.NODE_ENV !== "development",
});
return token

}