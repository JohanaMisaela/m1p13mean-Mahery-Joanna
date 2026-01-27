import * as userAddressService from "./userAddress.service.js";

export const addAddress = async (req, res, next) => {
    try {
        const address = await userAddressService.addAddress(req.user.id, req.body);
        res.json(address);
    } catch (err) {
        next(err);
    }
};

export const updateAddress = async (req, res, next) => {
    try {
        const address = await userAddressService.updateAddress(req.params.id, req.body);
        res.json(address);
    } catch (err) {
        next(err);
    }
};

export const deleteAddress = async (req, res, next) => {
    try {
        const address = await userAddressService.deleteAddress(req.params.id);
        res.json({ message: "Address deleted", addressId: address._id });
    } catch (err) {
        next(err);
    }
};

export const getAddresses = async (req, res, next) => {
    try {
        const addresses = await userAddressService.getAddressesByUser(req.user.id);
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};