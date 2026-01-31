import * as service from "./productRanking.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const rateProduct = asyncHandler(async (req, res) => {
    const result = await service.rateProduct(
        req.user._id,
        req.params.productId,
        req.body.rating
    );
    res.json(result);
});
