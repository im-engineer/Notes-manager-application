import React, { useState } from 'react';
import { updateNote } from '../api';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const EditNote = ({ note, setNotes, setEditingNote }) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [completed, setCompleted] = useState(note.completed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateNote(note._id, { title, description, completed });
      setNotes((prevNotes) =>
        prevNotes.map((t) => (t._id === note._id ? res.data : t))
      );
      setEditingNote(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Edit Note
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
          size="small"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          size="small"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              color="primary"
            />
          }
          label="Mark as completed"
          sx={{ my: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            fullWidth
          >
            Save
          </Button>
          <Button
            onClick={() => setEditingNote(null)}
            variant="outlined"
            startIcon={<CancelIcon />}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditNote; 