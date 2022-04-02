import Item from "./entity.js";

export const createItem = async (req, res) => {
  try {
    const newItem = new Item({ ...req.body, imageUrl: null });

    await newItem.save();

    return res.status(201).json({ data: newItem, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const getItemByQuery = async (req, res) => {
  const phrase = req.query.phrase;

  try {
    const items = await Item.find();

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(phrase.toLowerCase())
    );

    return res.status(200).json({ data: filteredItems, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
