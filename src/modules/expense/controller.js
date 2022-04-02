import Expense from "./entity.js";

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
    const expense = await Expense.findById(expenseId).populate("items.item");

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
