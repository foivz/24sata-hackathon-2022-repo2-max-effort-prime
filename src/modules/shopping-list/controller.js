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

    if (!shoppingList) {
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

export const deleteRegularShoppingListItem = async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const shoppingList = await ShoppingList.findByUserId(userId).populate(
      "items.item"
    );

    if (!shoppingList || shoppingList?.items.length === 0) {
      return res
        .status(404)
        .json({ message: "Users shopping list is empty", success: false });
    }

    console.log(shoppingList);

    const isItemAddedToUserShoppingList = shoppingList.items
      .map((shoppingListItem) => shoppingListItem.item._id.toString())
      .some((item) => item === itemId);

    if (!isItemAddedToUserShoppingList) {
      return res.status(404).json({
        message: "Item is not added to users shopping list",
        success: false,
      });
    }

    shoppingList.items = shoppingList.items.filter(
      (shoppingListItem) => shoppingListItem.item._id.toString() !== itemId
    );

    const shoppingListId = shoppingList._id;

    await ShoppingList.updateOne(
      { shoppingListId },
      {
        items: [...shoppingList.items],
        modifiedAt: Date.now(),
      }
    );

    return res.status(200).json({ success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
