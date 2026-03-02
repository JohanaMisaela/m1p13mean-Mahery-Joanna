import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import * as chatController from "./chat.controller.js";

const router = express.Router();

router.get(
  "/conversations",
  protect(["user", "shop", "admin"]),
  chatController.getConversations,
);
router.get(
  "/conversations/shop",
  protect(["shop", "admin"]),
  chatController.getShopConversations,
);
router.post(
  "/conversations/find-or-create",
  protect(["user", "shop", "admin"]),
  chatController.findOrCreateConversation,
);
router.get(
  "/unread-count",
  protect(["user", "shop", "admin"]),
  chatController.getGlobalUnreadCount,
);
router.get(
  "/unread-count/shop/:shopId",
  protect(["shop", "admin"]),
  chatController.getShopUnreadCount,
);

router.get(
  "/messages/:conversationId",
  protect(["user", "shop", "admin"]),
  chatController.getMessages,
);
router.post(
  "/messages",
  protect(["user", "shop", "admin"]),
  chatController.sendMessage,
);
router.patch(
  "/messages/:messageId",
  protect(["user", "shop", "admin"]),
  chatController.editMessage,
);
router.patch(
  "/messages/read/:conversationId",
  protect(["user", "shop", "admin"]),
  chatController.markAsRead,
);

export default router;
