import Expense from "./entity.js";
import Group from "../group/entity.js";
import Item from "../item/entity.js";

export const createExpense = async (req, res) => {
  const { userId } = req.params;

  try {
    const newExpense = new Expense({ ...req.body, user: userId });

    await newExpense.save();

    return res.status(201).json({ data: newExpense, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchExpensesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const userExpenses = await Expense.findAllByUserId(userId).populate(
      "items.item"
    );

    const data = userExpenses.map((userExpense) => ({
      _id: userExpense._id,
      amount: userExpense.amount,
      createdAt: userExpense.createdAt,
    }));

    return res.status(200).json({
      data,
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchExpenseItemsByExpenseId = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findOne({ _id: expenseId }).populate(
      "items.item"
    );
    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense not found", success: false });
    }

    const data = expense.items.map((expenseItem) => ({
      _id: expenseItem._id,
      name: expenseItem.item.name,
      quantity: expenseItem.quantity,
    }));

    return res.status(200).json({ data, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const assignExpenseToGroup = async (req, res) => {
  const { expenseId, groupId } = req.params;

  try {
    const expense = await Expense.findOne({ _id: expenseId });
    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense not found", success: false });
    }

    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    expense.group = groupId;

    const updatedExpense = await expense.save();

    return res.status(200).json({ data: updatedExpense, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const addItemToExpense = async (req, res) => {
  const { expenseId } = req.params;
  const newItem = req.body.item;

  try {
    const expense = await Expense.findOne({ _id: expenseId });
    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense not found", success: false });
    }

    const item = await Item.findOne({ _id: newItem.id });
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found", success: false });
    }

    expense.items = [...expense.items, newItem];

    const updatedExpense = await expense.save();

    return res.status(200).json({ data: updatedExpense, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
