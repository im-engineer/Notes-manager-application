import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    Link as MuiLink,
} from "@mui/material";
import { loginUser } from "../api";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await loginUser(values);
            localStorage.setItem("token", res.data.token);
            toast.success("Logged in successfully");
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Login failed");
        }
        setSubmitting(false);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    height: '100vh',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pt: -8
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Login
                </Typography>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <Field
                                as={TextField}
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <Field
                                as={TextField}
                                margin="normal"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{" "}
                                    <MuiLink
                                        component={Link}
                                        to="/register"
                                        variant="body2"
                                        sx={{ textDecoration: "none" }}
                                    >
                                        Sign up here
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default Login;
