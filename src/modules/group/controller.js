import { group } from "console";
import Group from "./entity.js";

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

    const userGroups = groups.filter((group) => {
      return group.members
        .map((member) => member._id.toString())
        .includes(userId);
    });

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

    return res.status(200).json({
      data: group,
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
      (member) => member._id.toString() != memberId
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
