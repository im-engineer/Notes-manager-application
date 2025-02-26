import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { updateNote, deleteNote } from '../api';
import { toast } from 'react-toastify';

const NoteList = ({ notes, onUpdate, onDelete }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditClick = (note) => {
    setEditingNote(note);
    setEditFormData({
      title: note.title,
      description: note.description || '',
      completed: note.completed || false,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setLoading(false);
    setEditDialogOpen(false);
    setEditingNote(null);
    setEditFormData({
      title: '',
      description: '',
      completed: false,
    });
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      await updateNote(editingNote._id, editFormData);
      toast.success('Note updated successfully');
      onUpdate();
      handleEditClose();
    } catch (err) {
      toast.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteNote(noteToDelete._id);
      toast.success('Note deleted successfully');
      onDelete();
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to delete note');
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setLoading(false);
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  if (!notes.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No notes found. Add your first note!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <List>
        {notes.map((note) => (
          <ListItem
            key={note._id}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1rem',
                    textDecoration: note.completed ? 'line-through' : 'none',
                    color: note.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {note.title}
                </Typography>
              }
              secondary={note.description}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Edit Note">
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditClick(note)}
                  sx={{
                    mr: 1,
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.dark',
                      bgcolor: 'primary.lighter',
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Note">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteClick(note)}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      color: 'error.dark',
                      bgcolor: 'error.lighter',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editFormData.completed}
                onChange={(e) => setEditFormData({ ...editFormData, completed: e.target.checked })}
                color="primary"
              />
            }
            label="Completed"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Note
        </DialogTitle>
        <DialogContent id="delete-dialog-description">
          <Typography>
            Are you sure you want to delete this note?
            {noteToDelete && (
              <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                "{noteToDelete.title}"
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoteList; 