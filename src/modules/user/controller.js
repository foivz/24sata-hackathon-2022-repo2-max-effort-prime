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

    return res.status(201).json({ data: newUser, success: true });
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
        .json({ success: false, message: "Invalid email or password!" });
    }

    return res.status(200).json({ data: user._id, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
