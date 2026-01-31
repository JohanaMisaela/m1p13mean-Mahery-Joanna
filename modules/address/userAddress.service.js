import UserAddress from "../address/userAddress.model.js";
import User from "../user/user.model.js";

export const addAddress = async (userId, data) => {
    const address = await UserAddress.create({ user: userId, ...data });

    if (data.isDefault) {
        await User.findByIdAndUpdate(userId, { defaultAddress: address._id });
    }

    return address;
};

export const updateAddress = async (addressId, data) => {
    const address = await UserAddress.findById(addressId);
    if (!address) throw new Error("Address not found");

    Object.assign(address, data);
    await address.save();

    if (data.isDefault) {
        await User.findByIdAndUpdate(address.user, { defaultAddress: address._id });
    }

    return address;
};

export const updateAddressStatus = async (addressId, isActive) => {
    const address = await UserAddress.findByIdAndUpdate(addressId, { isActive }, { new: true });
    if (!address) throw new Error("Address not found");

    const user = await User.findById(address.user);
    if (user.defaultAddress?.toString() === addressId) {
        user.defaultAddress = null;
        await user.save();
    }

    return address;
};

export const getAddressesByUser = async (userId) => {
    return UserAddress.find({ user: userId, isActive: { $ne: false } });
};

export const getAddressById = async (id) => {
    return UserAddress.findById(id);
};