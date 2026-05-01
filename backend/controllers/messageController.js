const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Message content required" });

    const message = new Message({
      senderId: req.user.id,
      senderName: req.user.name,
      content
    });
    await message.save();
    res.json({ message: "Message sent successfully", data: message });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
