const { User, Thought } = require('../models');
const { Types } = require('mongoose');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .select('-__v')
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: Types.ObjectId(req.params.id) })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        User.findOneAndUpdate(
          { _id: Types.ObjectId(req.body.userId) },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        )
          .then((user) => {
            if (!user) {
              return res.status(404).json({ message: 'No user with that ID' });
            }
            return res.json(user);
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
  // update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: Types.ObjectId(req.params.id) }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        return res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  // delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: Types.ObjectId(req.params.id) })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
        User.findOneAndUpdate(
          { _id: Types.ObjectId(thought.userId) },
          { $pull: { thoughts: thought._id } },
          { new: true }
        )
          .then((user) => {
            if (!user) {
              return res.status(404).json({ message: 'No user with that ID' });
            }
            return res.json(user);
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
};
