import * as userAddressService from "./userAddress.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const addAddress = asyncHandler(async (req, res) => {
    const address = await userAddressService.addAddress(req.user._id, req.body);
    res.json(address);
});

export const updateAddress = asyncHandler(async (req, res) => {
    const addressToCheck = await userAddressService.getAddressById(req.params.id);
    if (!addressToCheck) return res.status(404).json({ message: "Address not found" });

    if (addressToCheck.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const address = await userAddressService.updateAddress(req.params.id, req.body);
    res.json(address);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const addressToCheck = await userAddressService.getAddressById(req.params.id);
    if (!addressToCheck) return res.status(404).json({ message: "Address not found" });

    if (addressToCheck.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const { isActive } = req.body;
    const address = await userAddressService.updateAddressStatus(req.params.id, isActive);
    res.json({ message: "Address status updated", address });
});

export const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await userAddressService.getAddressesByUser(req.user._id);
    res.json(addresses);
});