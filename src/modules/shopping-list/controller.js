import ShoppingList, { ShoppingListTypes } from "./entity.js";
import User from "../user/entity.js";

export const addItemToRegularList = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const shoppingList = await ShoppingList.findByUserId(userId);
    let updatedShoppingList;

    if (shoppingList.length === 0) {
      const newShoppingList = new ShoppingList({
        items: [...req.body.items],
        user: req.body.user,
        type: ShoppingListTypes.REGULAR,
      });

      updatedShoppingList = await newShoppingList.save();
    } else {
      shoppingList.items = [...req.body.items];

      updatedShoppingList = await shoppingList.save();
    }

    return res.status(200).json({ data: updatedShoppingList, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
