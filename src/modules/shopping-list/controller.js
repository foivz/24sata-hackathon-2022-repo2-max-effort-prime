import ShoppingList, { ShoppingListTypes } from "./entity.js";
import User from "../user/entity.js";
import Expense from "../expense/entity.js";

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
      shoppingList.items = [...shoppingList.items, ...req.body.items];

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

export const fetchRegularShoppingListByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const shoppingList = await ShoppingList.findByUserId(userId).populate(
      "items.item"
    );

    let shoppingListItems = [];

    if (shoppingList === null)
      return res.status(200).json({
        data: {
          _id: null,
          type: ShoppingListTypes.REGULAR,
          items: [],
        },
        success: true,
      });

    for (let i = 0; i < shoppingList.items.length; i++) {
      const buyedQuantity = await numberOfBuyedItems(
        userId,
        shoppingList.items[i]._id.toString()
      );

      shoppingListItems.push({
        _id: shoppingList.items[i]._id,
        name: shoppingList.items[i].item.name,
        imageUrl: shoppingList.items[i].item.imageUrl,
        addedQuantity: shoppingList.items[i].quantity,
        buyedQuantity,
      });
    }

    return res.status(200).json({
      data: {
        _id: shoppingList._id.toString(),
        type: ShoppingListTypes.REGULAR,
        items: [...shoppingListItems],
      },
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

const numberOfBuyedItems = async (userId, shoppingListItemId) => {
  const userExpenses = await Expense.findAllByUserId(userId).populate(
    "items.item"
  );

  return userExpenses
    .flatMap((userExpense) => {
      return userExpense.items.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
      }));
    })
    .filter((item) => item._id.toString() === shoppingListItemId)
    .reduce((currentTotal, item) => currentTotal + item.quantity, 0);
};
