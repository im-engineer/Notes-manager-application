import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Avatar, Button, TextField, useTheme, useMediaQuery } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { getMe, updateMe } from '../api';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMe();
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateMe(values);
      setUser({ ...user, ...values });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
        }}
      >
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 4,
            p: 2,
            textAlign: 'center',
            color: 'error.main',
          }}
        >
          <Typography variant="h6">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 4 },
            width: '100%',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                bgcolor: 'primary.main',
                mb: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
            </Avatar>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                minWidth: 'auto',
                display: { xs: 'flex', sm: 'none' },
              }}
            >
              <EditIcon />
            </Button>
          </Box>

          {isEditing ? (
            <Formik
              initialValues={{
                name: user.name || '',
                email: user.email || '',
                password: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form style={{ width: '100%' }}>
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    label="New Password (optional)"
                    name="password"
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                      fullWidth={isMobile}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      fullWidth={isMobile}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="h6" gutterBottom>
                {user?.name}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Email
              </Typography>
              <Typography variant="h6">
                {user?.email}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 