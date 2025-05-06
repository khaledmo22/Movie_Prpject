
import express from "express";

import authRoutes from "./routes/auth.route.js";
import { ENV_VARS } from "./config/enVars.js";
import { connectDB } from "./config/db.js";

const app = express();

const PORT = ENV_VARS.PORT;

app.use(express.json()); //will allow us to parse req.body

app.use("/api/v1/auth",authRoutes);

app.listen(PORT, () =>{ 
    console.log("server started at http://localhost:"+PORT);
    connectDB();

});