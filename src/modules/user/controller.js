import bcrypt from "bcrypt";

import User from "./entity.js";

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

    return user._id;
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
