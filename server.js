import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import addressRoutes from "./modules/address/userAddress.routes.js";
import shopRoutes from "./modules/shop/shop.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import productRankingRoutes from "./modules/productRanking/productRanking.routes.js";
import shopRankingRoutes from "./modules/shopRanking/shopRanking.routes.js";
import productCommentRoutes from "./modules/productComment/productComment.routes.js";
import reportRoutes from "./modules/report/report.routes.js";

import connectDB from "./core/config/db.js";
import { swaggerSetup } from "./core/config/swagger.js";
import errorHandler from "./core/middlewares/error.middleware.js";


connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/product-ranking", productRankingRoutes);
app.use("/api/shop-ranking", shopRankingRoutes);
app.use("/api/product-comments", productCommentRoutes);
app.use("/api/reports", reportRoutes);

swaggerSetup(app);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
