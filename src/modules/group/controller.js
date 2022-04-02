import Group from "./entity.js";

export const createGroup = async (req, res) => {
  try {
    const newGroup = new Group({ ...req.body });

    await newGroup.save();

    return res.status(201).json({ data: newGroup, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
