const { User } = require('../models');
const { Types } = require('mongoose');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: Types.ObjectId(req.params.id) })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: Types.ObjectId(req.params.id) })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({ message: 'User deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: Types.ObjectId(req.params.id) }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  // add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: Types.ObjectId(req.params.id) },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  // remove a friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: Types.ObjectId(req.params.id) },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        return res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
};
