import bcrypt from "bcrypt";

import User from "./entity.js";

export const register = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(400).json({
        message: `User with phone number ${phoneNumber} is already registered!`,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({
      data: newUser,
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const passwordMatch = await bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password!", success: false });
    }

    return res.status(200).json({ data: user, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const { phoneNumber, ...rest } = req.body;

    await User.updateOne({ userId }, { ...rest, modifiedAt: Date.now() });

    return res.status(200).json({ success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({ data: users, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
