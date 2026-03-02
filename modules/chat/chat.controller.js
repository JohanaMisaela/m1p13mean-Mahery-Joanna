import { Conversation, Message } from "./chat.model.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import Shop from "../shop/shop.model.js";

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ customer: req.user._id })
    .populate("shop", "name logo")
    .populate("shopOwner", "name surname")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        sender: { $ne: req.user._id },
        isRead: false,
      });
      return { ...conv.toObject(), unreadCount };
    }),
  );

  res.status(200).json(conversationsWithUnread);
});

export const getShopConversations = asyncHandler(async (req, res) => {
  const { shopId } = req.query;

  // 1. If no specific shopId, show all conversations for all shops owned by the user
  if (!shopId || shopId === "null" || shopId === "undefined") {
    const conversations = await Conversation.find({ shopOwner: req.user._id })
      .populate("customer", "_id name surname")
      .populate("shop", "name logo")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          sender: { $ne: conv.shopOwner }, // In dashboard, I am the shop side
          isRead: false,
        });
        return { ...conv.toObject(), unreadCount };
      }),
    );
    return res.status(200).json(conversationsWithUnread);
  }

  // 2. If shopId is provided, verify the user has permission to see messages for this shop
  if (req.user.role !== "admin") {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this shop's messages" });
    }
  }

  // 3. User is authorized (admin or owner), show all conversations for this shop
  const conversations = await Conversation.find({ shop: shopId })
    .populate("customer", "_id name surname")
    .populate("shop", "name logo")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        sender: { $ne: req.user._id },
        isRead: false,
      });
      return { ...conv.toObject(), unreadCount };
    }),
  );

  res.status(200).json(conversationsWithUnread);
});

export const findOrCreateConversation = asyncHandler(async (req, res) => {
  const { shopId } = req.body;

  if (!shopId) {
    return res.status(400).json({ message: "Shop ID is required" });
  }

  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  let conversation = await Conversation.findOne({
    customer: req.user._id,
    shop: shopId,
  }).populate("shop", "name logo openingHours");

  if (!conversation) {
    conversation = await Conversation.create({
      customer: req.user._id,
      shop: shopId,
      shopOwner: shop.owner,
    });
    // Populate the newly created conversation
    conversation = await Conversation.findById(conversation._id).populate(
      "shop",
      "name logo openingHours",
    );
  }

  res.status(200).json(conversation);
});

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation)
    return res.status(404).json({ message: "Conversation not found" });

  if (
    req.user.role !== "admin" &&
    conversation.customer.toString() !== req.user._id.toString() &&
    conversation.shopOwner.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "Not authorized to view this chat" });
  }

  const messages = await Message.find({ conversationId }).sort({
    createdAt: 1,
  });

  res.status(200).json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { shopId, content, images, isDashboard } = req.body;
  let { conversationId } = req.body;

  let conversation;

  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
  } else if (shopId) {
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    conversation = await Conversation.findOne({
      customer: req.user._id,
      shop: shopId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        customer: req.user._id,
        shop: shopId,
        shopOwner: shop.owner,
      });
    }
  }

  if (!conversation) {
    return res
      .status(400)
      .json({ message: "Conversation or Shop ID required" });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    sender: isDashboard ? conversation.shopOwner : req.user._id,
    content,
    images,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json(message);
});

export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ message: "Message not found" });

  if (message.sender.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to edit this message" });
  }

  message.content = content;
  message.isEdited = true;
  await message.save();

  res.status(200).json(message);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation)
    return res.status(404).json({ message: "Conversation not found" });

  const isShopSide =
    req.user.role === "admin" ||
    conversation.shopOwner.toString() === req.user._id.toString();
  const readerId = isShopSide ? conversation.shopOwner : req.user._id;

  await Message.updateMany(
    { conversationId, sender: { $ne: readerId }, isRead: false },
    { $set: { isRead: true } },
  );

  res.status(200).json({ message: "Messages marked as read" });
});
export const getGlobalUnreadCount = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    $or: [{ customer: req.user._id }, { shopOwner: req.user._id }],
  });

  const unreadCounts = await Promise.all(
    conversations.map(async (conv) => {
      const isShopSide = conv.shopOwner.toString() === req.user._id.toString();
      const shopOwnerId = conv.shopOwner._id || conv.shopOwner;
      const customerId = conv.customer._id || conv.customer;

      const readerId = isShopSide ? shopOwnerId : customerId;

      return Message.countDocuments({
        conversationId: conv._id,
        sender: { $ne: readerId },
        isRead: false,
      });
    }),
  );

  const totalUnread = unreadCounts.reduce((acc, count) => acc + count, 0);
  res.status(200).json({ totalUnread });
});

export const getShopUnreadCount = asyncHandler(async (req, res) => {
  const { shopId } = req.params;

  const conversations = await Conversation.find({ shop: shopId });
  const conversationIds = conversations.map((c) => c._id);

  // For shop dashboard, we only care about messages NOT from the shopOwner
  // We assume the first conversation's shopOwner is representative (they all share the same shop)
  if (conversations.length === 0)
    return res.status(200).json({ totalUnread: 0 });

  const shopOwnerId = conversations[0].shopOwner;

  const totalUnread = await Message.countDocuments({
    conversationId: { $in: conversationIds },
    sender: { $ne: shopOwnerId.toString() },
    isRead: false,
  });

  res.status(200).json({ totalUnread });
});
