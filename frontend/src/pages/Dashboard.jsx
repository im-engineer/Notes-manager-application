import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getNotes } from "../api";
import NoteList from "../components/NoteList";
import AddNote from "../components/AddNote";
import EditNote from "../components/EditNote";
import {
    Container,
    Stack,
    Paper,
    Typography,
    Pagination,
    Box,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from "@mui/material";

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNotes = async (pageNum = 1) => {
        try {
            setApiLoading(true);
            const res = await getNotes(pageNum);
            setNotes(res.data.notes);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch notes");
        } finally {
            setLoading(false);
            setApiLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        fetchNotes(value);
    };

    const handleAddNote = async (newNote) => {
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        if (notes.length >= 10) {
            await fetchNotes(currentPage + 1);
        }
    };

    const handleUpdateNote = async () => {
        await fetchNotes(currentPage);
    };

    const handleDeleteNote = async () => {
        await fetchNotes(currentPage);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    zIndex: 1000,
                }}
            >
                <CircularProgress size={48} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ position: "relative", py: 4 }}>
                {apiLoading && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            zIndex: 1000,
                        }}
                    >
                        <CircularProgress size={48} thickness={4} />
                    </Box>
                )}

                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ 
                        mb: 4,
                        fontSize: isMobile ? '1.75rem' : '2.125rem'
                    }}
                >
                    Note Dashboard
                </Typography>

                <Stack 
                    spacing={4} 
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{ width: '100%' }}
                >
                    <Box 
                        sx={{ 
                            p: 2,
                            width: { xs: '100%', sm: 'auto' },
                            backgroundColor: 'white',
                            height: '10%',
                            borderRadius: '10px',
                        }}

                    >
                        <AddNote onAdd={handleAddNote} />
                    </Box>
                    <Stack width="100%">
                        <Paper sx={{ p: 2 }}>
                            <NoteList
                                notes={notes}
                                onUpdate={handleUpdateNote}
                                onDelete={handleDeleteNote}
                                setEditingNote={setEditingNote}
                            />
                            {(totalPages > 1 || notes.length >= 10) && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 4,
                                        '& .MuiPagination-ul': {
                                            flexWrap: 'nowrap'
                                        }
                                    }}
                                >
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size={isMobile ? "medium" : "large"}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    );
};

export default Dashboard;
