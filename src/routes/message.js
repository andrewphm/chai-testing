const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Message = require('../models/message');

/** Route to get all messages. */
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/** Route to get one message by id. */
router.get('/:messageId', async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    res.json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/** Route to add a new message. */
router.post('/', async (req, res) => {
  let message = new Message(req.body);
  message
    .save()
    .then((message) => {
      return User.findById(message.author);
    })
    .then((user) => {
      // console.log(user)
      user.messages.unshift(message);
      return user.save();
    })
    .then(() => {
      return res.send(message);
    })
    .catch((err) => {
      throw err.message;
    });
});

/** Route to update an existing message. */
router.put('/:messageId', async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.messageId, req.body, {
      new: true,
    });
    return res.json(updatedMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/** Route to delete a message. */
router.delete('/:messageId', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.messageId);
    const user = await User.findById(message.author);
    user.messages.pull(message);
    await user.save();
    return res.json({ message: 'Message has been deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
