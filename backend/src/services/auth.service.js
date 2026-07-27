import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

export const registerService = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const token = generateToken(user._id);

    return {
        user,
        token,
    };
};

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    user.password = undefined;

    const token = generateToken(user._id);

    return {
        user,
        token,
    };
};