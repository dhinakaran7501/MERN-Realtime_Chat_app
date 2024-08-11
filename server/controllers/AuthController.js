import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const maxAge = 3 * 2 * 60 * 60 * 1000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isEmail = await User.findOne({ email: email });
    if (isEmail) {
      return res.status(200).json({
        status: 0,
        message: "This email is already exists",
      });
    }

    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      status: 1,
      message: "User created Successfully",
      data: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(200).json({
        status: 0,
        message: "User with the given email is not found.",
      });
    }

    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }

    const isPasswordMatch = await compare(password, isUser.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        status: 0,
        message: "Password is incorrect",
      });
    }

    res.cookie("jwt", createToken(email, isUser.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      status: 1,
      message: "User loggedin Successfully",
      data: {
        id: isUser.id,
        email: isUser.email,
        firstName: isUser.firstName,
        lastName: isUser.lastName,
        image: isUser.image,
        profileSetup: isUser.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).json({
      status: 1,
      message: "User loggedin Successfully",
      data: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        profileSetup: userData.profileSetup,
        color: userData.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .send("Fristname, Last name and color required fields.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      status: 1,
      message: "User Details updated Successfully",
      data: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        profileSetup: userData.profileSetup,
        color: userData.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 0,
        message: "File is required.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: `/uploads/${req.file.filename}` },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      status: 1,
      message: "Image updated Successfully",
      data: {
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).send("User not found.");
    }

    if (user.image) {
      const imagePath = path.join(__dirname, "uploads", user.image); // Adjust the directory as per your setup
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.log("File not found:", imagePath);
      }
    }
    user.image = null;
    await user.save();

    return res.status(200).json({
      status: 1,
      message: "Image deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).json({
      status: 1,
      message: "Logout Successfull.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};
