const Note = require('../models/Note');

// @route   GET /notes
const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments({ user: req.user.id });
    const totalPages = Math.ceil(totalNotes / limit);

    return res.status(200).json({
      notes,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });   
  }
};

// @route   POST /notes
const createNote = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "Please add a title field" });
    }

    const note = await Note.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route   PUT /notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check for user 
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // check the user id matches with the note user id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json(updatedNote);
  } catch (error) {
    return res.status(500).json({ message: error.message });    
  }
};

// @route   DELETE /notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check for user exists or not
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // check the user id matches with the note user id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await Note.deleteOne({ _id: req.params.id });

    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
}; 