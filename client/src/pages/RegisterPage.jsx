import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import toast from "react-hot-toast";

import { registerUser } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      confirmPassword,
    } = formData;

    // Validation
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        username,
        email,
        password,
      });

      toast.success(data.message);

      navigate("/");
    } 
    catch (error) {
  console.log(error);
  console.log(error.response);

  toast.error(
    error.response?.data?.message || "Registration failed"
  );
}
    
    // catch (error) {
    //   toast.error(
    //     error.response?.data?.message || "Registration failed"
    //   );
     finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        component="form"
        elevation={5}
        onSubmit={handleRegister}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={4}
        >
          Create Account
        </Typography>

        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;