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

    return res.status(200).json({ data: userExpenses, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};
