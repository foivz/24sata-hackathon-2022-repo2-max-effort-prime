import Group from "./entity.js";
import Expense from "../expense/entity.js";

export const createGroup = async (req, res) => {
  try {
    const newGroup = new Group({ ...req.body });

    await newGroup.save();

    return res.status(201).json({ data: newGroup, success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const updateGroupMemebers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    const groupMemberIds = group.members.map((member) => member._id.toString());

    const newMembers = req.body.members.filter(
      (memberId) => !groupMemberIds.includes(memberId)
    );

    await Group.updateOne(
      { groupId },
      {
        members: [...groupMemberIds, ...newMembers],
        modifiedAt: Date.now(),
      }
    );

    return res.status(200).json({ success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchGroupsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const groups = await Group.find().populate("members");

    let userGroups = [];

    for (let i = 0; i < groups.length; i++) {
      if (
        groups[i].members
          .map((member) => member._id.toString())
          .includes(userId)
      ) {
        const currentGroupExpenses = await calculateGroupCurrentMonthExpenses(
          groups[i]
        );

        userGroups.push({
          _id: groups[i]._id,
          name: groups[i].name,
          members: [...groups[i].members],
          monthlyBudget: groups[i].monthlyBudget,
          currentGroupExpenses,
        });
      }
    }

    return res.status(200).json({
      data: userGroups,
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members");
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    return res.status(200).json({
      data: group.members,
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const fetchGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members");
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    const currentGroupExpenses = await calculateGroupCurrentMonthExpenses(
      groupId
    );

    return res.status(200).json({
      data: {
        _id: group._id,
        name: group.name,
        members: [...group.members],
        currentGroupExpenses,
        monthlyBudget: group.monthlyBudget,
      },
      success: true,
    });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const deleteGroupMemeber = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members");
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    const isUserGroupMember = group.members
      .map((member) => member._id.toString())
      .some((member) => member === memberId);

    if (!isUserGroupMember) {
      return res
        .status(404)
        .json({ message: "User is not group member", success: false });
    }

    group.members = group.members.filter(
      (member) => member._id.toString() !== memberId
    );

    await Group.updateOne(
      { groupId },
      {
        members: [...group.members],
        modifiedAt: Date.now(),
      }
    );

    return res.status(200).json({ success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const updateGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found", success: false });
    }

    await Group.updateOne({ groupId }, { ...req.body, modifiedAt: Date.now() });

    return res.status(200).json({ success: true });
  } catch ({ message }) {
    return res.status(500).json({ message, success: false });
  }
};

export const calculateGroupCurrentMonthExpenses = async (groupId) => {
  const now = new Date();

  const groupExpenses = await Expense.findAllByGroupId(groupId);

  if (groupExpenses.length === 0) {
    return 0;
  }

  return groupExpenses
    .filter(
      (groupExpense) =>
        groupExpense.createdAt.getDate() < now.getDate() &&
        groupExpense.createdAt.getMonth() === now.getMonth()
    )
    .flatMap((expense) => ({ amount: expense.amount }))
    .reduce((currentTotal, item) => currentTotal + item.amount, 0);
};
