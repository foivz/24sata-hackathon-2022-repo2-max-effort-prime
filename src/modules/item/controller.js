import Item from "./entity.js";
import ShoppingList from "../shopping-list/entity.js";

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
  const { phrase, userId } = req.query;

  try {
    const items = await Item.find().lean();

    const usersShoppingList = await ShoppingList.findByUserId(userId).populate(
      "items.item"
    );

    let filteredItems = items
      .filter((item) => item.name.toLowerCase().includes(phrase.toLowerCase()))
      .map((item) => ({ ...item, _id: item._id.toString() }));

    const usersShoppingListItemsIds = usersShoppingList.items.map(
      (usersShoppingListItem) => {
        return usersShoppingListItem.item._id.toString();
      }
    );

    if (usersShoppingList.items.length === 0) {
      filteredItems = filteredItems.map((item) => ({ ...item, quantity: 1 }));
    } else {
      filteredItems = filteredItems.map((item) => {
        if (usersShoppingListItemsIds.includes(item._id)) {
          const shoppingListItem = usersShoppingList.items
            .map((shoppingListItem) => ({
              quantity: shoppingListItem.quantity,
              _id: shoppingListItem.item._id.toString(),
            }))
            .find((shoppingListItem) => shoppingListItem._id === item._id);

          return {
            ...item,
            quantity: shoppingListItem.quantity,
          };
        } else {
          return {
            ...item,
            quantity: 1,
          };
        }
      });
    }

    return res.status(200).json({ data: filteredItems, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
