import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import sgaImage from "../images/SGA.jpg";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Link,
  Box,
} from "@mui/material";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData
      );
      alert(`Bienvenido ${response.data.user.name}`);
      onLogin(); // Activa la autenticación en el componente principal
      navigate("/"); // Redirige al Home
    } catch (error) {
      console.error(error.response.data);
      alert("Credenciales incorrectas");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        formData
      );
      alert(response.data.message);
      setShowRegister(false); // Cambia a la pantalla de login tras registro exitoso
    } catch (error) {
      console.error(error.response.data);
      alert("Error en el registro");
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        position: "fixed", // Fija el componente en el viewport
        top: 0, // Posición superior
        left: 0, // Posición izquierda
        right: 0, // Posición derecha
        bottom: 0, // Posición inferior
        backgroundImage: `url(${sgaImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex", // Flexbox para centrar contenido
        justifyContent: "center", // Centra horizontalmente
        alignItems: "center", // Centra verticalmente
      }}
    >
      <Box
        style={{
          backgroundColor: "white", // Fondo blanco
          borderRadius: "8px", // Bordes redondeados para mejor estética
          padding: "20px", // Espaciado interno
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra sutil
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom align="center">
            {showRegister ? "Registro" : "Iniciar Sesión"}
          </Typography>
          <form
            onSubmit={showRegister ? handleRegisterSubmit : handleLoginSubmit}
          >
            <Grid container spacing={2}>
              {showRegister && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="id"
                      label="NIT de la Empresa"
                      variant="outlined"
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Nombre"
                      variant="outlined"
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="direccion"
                      label="Dirección"
                      variant="outlined"
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="telefono"
                      label="Teléfono"
                      variant="outlined"
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Correo"
                  type="email"
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {showRegister ? "Registrar" : "Iniciar Sesión"}
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setShowRegister(!showRegister)}
                >
                  {showRegister
                    ? "¿Ya tienes una cuenta? Inicia sesión"
                    : "¿No tienes una cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </Paper>
  );
};

export default Login;
