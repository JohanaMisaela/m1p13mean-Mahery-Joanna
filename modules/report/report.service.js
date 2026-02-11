import Report from "./report.model.js";
import Product from "../product/product.model.js";

export const createReport = async (userId, data) => {
    return Report.create({
        reporter: userId,
        ...data
    });
};

export const getAllReports = async (query = {}) => {
    const { status, page = 1, limit = 50 } = query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Report.countDocuments(filter);
    const data = await Report.find(filter)
        .populate("reporter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const updateReportStatus = async (reportId, status) => {
    return Report.findByIdAndUpdate(reportId, { status }, { new: true });
};

export const getUserReports = async (userId, query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { reporter: userId };

    const total = await Report.countDocuments(filter);
    const data = await Report.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const getShopRelatedReports = async (shopId, query = {}) => {
    const { status, targetType, page = 1, limit = 50 } = query;
    let filter = {};

    if (status) filter.status = status;

    // Get all products for this shop to filter reports on those products
    const shopProducts = await Product.find({ shop: shopId }).select("_id");
    const productIds = shopProducts.map(p => p._id);

    // Filter by targetType if provided, otherwise get both
    if (targetType === 'shop') {
        filter.targetType = 'shop';
        filter.targetId = shopId;
    } else if (targetType === 'product') {
        filter.targetType = 'product';
        filter.targetId = { $in: productIds };
    } else {
        // Get reports for the shop itself OR its products
        filter.$or = [
            { targettype: 'shop', targetId: shopId }, // Note: targettype (lowercase) or targetType? Check model.
            { targetType: 'shop', targetId: shopId },
            { targetType: 'product', targetId: { $in: productIds } }
        ];
    }

    // Model has targetType (camelCase), but let's be safe with the $or query above (removed lowercase check after verifying model)
    if (!targetType) {
        filter = {
            ...filter,
            $or: [
                { targetType: 'shop', targetId: shopId },
                { targetType: 'product', targetId: { $in: productIds } }
            ]
        };
        delete filter.targetType; // Ensure we don't conflict
        delete filter.targetId;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Report.countDocuments(filter);

    const reports = await Report.find(filter)
        .populate("reporter", "name surname email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    // Manually populate target details since it's dynamic
    const populatedReports = await Promise.all(reports.map(async (report) => {
        let target = null;
        if (report.targetType === 'product') {
            target = await Product.findById(report.targetId).select("name images");
        } else if (report.targetType === 'shop') {
            // We already know the shop, but consistent return structure helps
            // Assuming we want basic info, but we have shopId. 
            // Let's just return basic info or rely on frontend knowing the shop.
            // Importing Shop model would be circular potentially if not careful, 
            // but Product imports Shop usually. Let's start with just Product logic 
            // or assume Shop is static for this view.
            // Actually, the user might want to see "Target: This Shop".
        }
        return { ...report, targetDetails: target };
    }));

    return { data: populatedReports, total };
};
