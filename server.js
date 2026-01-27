import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// import authRoutes from "./modules/auth/authRoutes.js";
// import adminRoutes from "./modules/admin/adminRoutes.js";
// import boutiqueRoutes from "./modules/boutique/boutiqueRoutes.js";
// import userRoutes from "./modules/user/userRoutes.js";

import connectDB from "./core/config/db.js";
import { swaggerSetup } from "./core/config/swagger.js";

// import { errorHandler } from "./core/middlewares/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/boutique", boutiqueRoutes);
// app.use("/api/user", userRoutes);

swaggerSetup(app);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
