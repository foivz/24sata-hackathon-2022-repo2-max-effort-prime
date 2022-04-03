import bcrypt from "bcrypt";

import User from "./entity.js";
import Expense from "../expense/entity.js";
import dayjs from "dayjs";

export const register = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(400).json({
        message: `User with phone number ${phoneNumber} is already registered!`,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ ...req.body, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({
      data: newUser,
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const passwordMatch = await bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password!", success: false });
    }

    return res.status(200).json({ data: user, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const { phoneNumber, ...rest } = req.body;

    await User.updateOne({ userId }, { ...rest, modifiedAt: Date.now() });

    return res.status(200).json({ success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({ data: users, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchDashboardDataByUserId = async (req, res) => {
  const { userId } = req.params;
  const now = new Date();

  const thisMonthBeginning = dayjs().startOf("month");

  // Prosli
  const previousMonthBeggining = thisMonthBeginning
    .subtract(1, "month")
    .startOf("month");
  const previousMonthEnding = previousMonthBeggining.endOf("month");

  // Predprosli
  const previousMonthBeggining2 = previousMonthBeggining
    .subtract(1, "month")
    .startOf("month");
  const previousMonthEnding2 = previousMonthBeggining2.endOf("month");

  // Predpredprosli
  const previousMonthBeggining3 = previousMonthBeggining2
    .subtract(1, "month")
    .startOf("month");
  const previousMonthEnding3 = previousMonthBeggining3.endOf("month");

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let graphData = await Expense.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousMonthBeggining.toDate(),
            $lte: previousMonthEnding.toDate(),
          },
        },
      },
      { $group: { _id: null, amount: { $sum: "$amount" } } },
    ]);

    graphData[0].month = previousMonthBeggining.month();
    graphData[0].amount = graphData[0].amount ? graphData[0].amount : 0;

    graphData.push(
      await Expense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousMonthBeggining2.toDate(),
              $lte: previousMonthEnding2.toDate(),
            },
          },
        },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ])
    );

    graphData[1].month = previousMonthBeggining2.month();
    graphData[1].amount = graphData[1].amount ? graphData[1].amount : 0;

    graphData.push(
      await Expense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousMonthBeggining3.toDate(),
              $lte: previousMonthEnding3.toDate(),
            },
            user: userId,
          },
        },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ])
    );

    graphData[2].month = previousMonthBeggining3.month();
    graphData[2].amount = graphData[2].amount ? graphData[2].amount : 0;

    graphData = graphData.map((data) => ({
      month: data.month,
      amount: data.amount,
    }));

    graphData = graphData.sort((a, b) =>
      a.month < b.month ? -1 : a.month === b.month ? 0 : 1
    );

    const prediction = predictNextThreeMonths([
      graphData[0].amount,
      graphData[1].amount,
      graphData[2].amount,
    ]);

    graphData.push({
      month: thisMonthBeginning.add(1, "month").month(),
      amount: prediction[0],
    });

    graphData.push({
      month: thisMonthBeginning.add(2, "month").month(),
      amount: prediction[1],
    });

    graphData.push({
      month: thisMonthBeginning.add(3, "month").month(),
      amount: prediction[2],
    });

    const currentMonthExpenses = await calculateUserCurrentMonthExpenses(
      userId
    );

    return res.status(200).json({
      data: {
        graphData,
        monthlyBudget: user.monthlyBudget,
        currentMonthExpenses,
      },
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

const predictNextMonth = (data) => {
  // Težine perioda -> definiraju da zadnji mjesec ima najveću važnost u predviđanju (0.50), predzanji manju (0.33) i predpredzanji još manju (0.17)
  const periodWeights = [0.17, 0.33, 0.5];

  // Tu se sprema umnozak troskova i tezine perioda za taj mjesec
  const expensesWeights = [];

  data.forEach((expense, index) => {
    const weight = periodWeights[index];
    expensesWeights.push(expense * weight);
  });

  const nextMonth = expensesWeights.reduce(
    (prediction, currentValue) => prediction + currentValue,
    0
  );
  return nextMonth;
};

const predictNextThreeMonths = (data) => {
  for (let i = 0; i < 3; i++) {
    const predicted = predictNextMonth(data);
    const rounded = Math.round(predicted * 100) / 100;
    data.push(rounded);
    data.shift();
  }

  return data;
};

export const fetchUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({ data: user, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

const calculateUserCurrentMonthExpenses = async (userId) => {
  const thisMonthBeginning = dayjs().startOf("month");
  const thisMonthEnding = dayjs().endOf("month");

  const currentMonthUserExpenses = await Expense.aggregate([
    {
      $match: {
        createdAt: {
          $gte: thisMonthBeginning.toDate(),
          $lte: thisMonthEnding.toDate(),
        },
      },
    },
    { $group: { _id: null, amount: { $sum: "$amount" } } },
  ]);

  return currentMonthUserExpenses[0].amount;
};
