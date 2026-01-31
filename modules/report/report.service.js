import Report from "./report.model.js";

export const createReport = async (userId, data) => {
    return Report.create({
        reporter: userId,
        ...data
    });
};

export const getAllReports = async (status) => {
    const filter = status ? { status } : {};
    return Report.find(filter)
        .populate("reporter", "name email")
        .sort({ createdAt: -1 });
};

export const updateReportStatus = async (reportId, status) => {
    return Report.findByIdAndUpdate(reportId, { status }, { new: true });
};

export const getUserReports = async (userId) => {
    return Report.find({ reporter: userId }).sort({ createdAt: -1 });
};
