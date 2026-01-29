import * as userAddressService from "./userAddress.service.js";

export const addAddress = async (req, res, next) => {
    try {
        const address = await userAddressService.addAddress(req.user._id, req.body);
        res.json(address);
    } catch (err) {
        next(err);
    }
};

export const updateAddress = async (req, res, next) => {
    try {
        const addressToCheck = await userAddressService.getAddressById(req.params._id);
        if (!addressToCheck) return res.status(404).json({ message: "Address not found" });

        if (addressToCheck.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const address = await userAddressService.updateAddress(req.params._id, req.body);
        res.json(address);
    } catch (err) {
        next(err);
    }
};

export const deleteAddress = async (req, res, next) => {
    try {
        const addressToCheck = await userAddressService.getAddressById(req.params._id);
        if (!addressToCheck) return res.status(404).json({ message: "Address not found" });

        if (addressToCheck.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const address = await userAddressService.deleteAddress(req.params._id);
        res.json({ message: "Address deleted", addressId: address._id });
    } catch (err) {
        next(err);
    }
};

export const getAddresses = async (req, res, next) => {
    try {
        const addresses = await userAddressService.getAddressesByUser(req.user._id);
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};