import UserAddress from "../address/userAddress.model.js";

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

export const deleteAddress = async (addressId) => {
    const address = await UserAddress.findByIdAndDelete(addressId);
    if (!address) throw new Error("Address not found");

    const user = await User.findById(address.user);
    if (user.defaultAddress?.toString() === addressId) {
        user.defaultAddress = null;
        await user.save();
    }

    return address;
};

export const getAddressesByUser = async (userId) => {
    return UserAddress.find({ user: userId });
};