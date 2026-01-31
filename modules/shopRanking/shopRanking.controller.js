import * as service from "./shopRanking.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const rateShop = asyncHandler(async (req, res) => {
    const result = await service.rateShop(
        req.user._id,
        req.params.shopId,
        req.body.rating
    );
    res.json(result);
});
