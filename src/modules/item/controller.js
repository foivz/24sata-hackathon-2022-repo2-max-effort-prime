import Item from "./entity.js";

export const createItem = async (req, res) => {
  try {
    const newItem = new Item({ ...req.body });

    await newItem.save();

    return res.status(201).json({ data: newItem, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
