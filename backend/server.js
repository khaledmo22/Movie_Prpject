import express from "express";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRoute.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { ENV_VARS } from "./config/enVars.js";
import { connectDB } from "./config/db.js";

// Initialize app first
const app = express();

// Now use middleware and routes
app.use(cors());
app.use(express.json()); // Parse req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie",protectRoute, movieRoutes);
app.use("/api/v1/tv",protectRoute, tvRoutes);
app.use("/api/v1/search",protectRoute, searchRoutes);




const PORT = ENV_VARS.PORT;

app.listen(PORT, () => { 
    console.log("Server started at http://localhost:" + PORT);
    connectDB();
});