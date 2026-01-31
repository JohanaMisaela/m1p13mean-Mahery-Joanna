import Report from "./report.model.js";

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
